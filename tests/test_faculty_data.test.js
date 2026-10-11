const test = require('node:test');
const assert = require('node:assert');
const {
  FACULTIES, PROGRAMS, getFacultyLabel, getPrograms, getProgramLabel, isValidFaculty, isValidProgram,
} = require('../src/utils/facultyData');

test('facultyData - values are unique and every faculty has a label', () => {
  const values = FACULTIES.map((f) => f.value);
  assert.strictEqual(new Set(values).size, values.length);
  assert.ok(FACULTIES.every((f) => f.label && f.value));
  assert.strictEqual(FACULTIES.length, 19);
});

test('facultyData - program lists only exist for known faculties and are unique', () => {
  for (const [faculty, programs] of Object.entries(PROGRAMS)) {
    assert.ok(isValidFaculty(faculty), `unknown faculty key ${faculty}`);
    const values = programs.map((p) => p.value);
    assert.strictEqual(new Set(values).size, values.length);
  }
});

test('facultyData - ICT, business and agriculture program counts', () => {
  assert.strictEqual(getPrograms('ict').length, 8);
  assert.strictEqual(getPrograms('business-communication').length, 8);
  assert.strictEqual(getPrograms('agriculture').length, 5);
});

test('facultyData - faculty without a list returns an empty program array', () => {
  assert.deepStrictEqual(getPrograms('law'), []);
  assert.deepStrictEqual(getPrograms('unknown'), []);
  assert.deepStrictEqual(getPrograms('constructor'), []); // no prototype-key lookup
  assert.deepStrictEqual(getPrograms(undefined), []);
});

test('facultyData - program validity is per faculty', () => {
  assert.strictEqual(isValidProgram('ict', 'software-engineering'), true);
  assert.strictEqual(isValidProgram('business-communication', 'software-engineering'), false);
  assert.strictEqual(isValidProgram('law', 'anything'), false);
});

test('facultyData - label lookups', () => {
  assert.strictEqual(getFacultyLabel('ict'), 'คณะเทคโนโลยีสารสนเทศและการสื่อสาร (ICT)');
  assert.strictEqual(getProgramLabel('ict', 'software-engineering'), 'วิศวกรรมซอฟต์แวร์');
  assert.strictEqual(getFacultyLabel('nope'), '');
  assert.strictEqual(getProgramLabel('ict', 'nope'), '');
});

// ---- picking faculty and program in either order ----
const {
  getAllPrograms, getFacultyOfProgram, applyFacultyChange, applyProgramChange, normalizeFilter,
} = require('../src/utils/facultyData');

test('facultyData - program keys are unique across all faculties', () => {
  const all = getAllPrograms();
  assert.strictEqual(new Set(all.map((p) => p.value)).size, all.length);
  assert.strictEqual(all.length, 21);
  assert.ok(all.every((p) => getFacultyOfProgram(p.value) === p.faculty));
});

test('facultyData - getFacultyOfProgram', () => {
  assert.strictEqual(getFacultyOfProgram('accounting'), 'business-communication');
  assert.strictEqual(getFacultyOfProgram('food-safety'), 'agriculture');
  assert.strictEqual(getFacultyOfProgram('nope'), '');
  assert.strictEqual(getFacultyOfProgram(''), '');
});

test('facultyData - choosing a program first fills in its faculty', () => {
  assert.deepStrictEqual(applyProgramChange({ faculty: '', program: '' }, 'accounting'),
    { faculty: 'business-communication', program: 'accounting' });
  // choosing a program of another faculty switches the faculty too
  assert.deepStrictEqual(applyProgramChange({ faculty: 'ict', program: 'computer-science' }, 'accounting'),
    { faculty: 'business-communication', program: 'accounting' });
});

test('facultyData - clearing the program keeps the faculty', () => {
  assert.deepStrictEqual(applyProgramChange({ faculty: 'ict', program: 'computer-science' }, ''),
    { faculty: 'ict', program: '' });
});

test('facultyData - changing the faculty drops a program of another faculty but keeps a matching one', () => {
  assert.deepStrictEqual(applyFacultyChange({ faculty: 'ict', program: 'computer-science' }, 'law'),
    { faculty: 'law', program: '' });
  assert.deepStrictEqual(applyFacultyChange({ faculty: '', program: 'computer-science' }, 'ict'),
    { faculty: 'ict', program: 'computer-science' });
  assert.deepStrictEqual(applyFacultyChange({ faculty: 'ict', program: 'computer-science' }, ''),
    { faculty: '', program: '' });
});

test('facultyData - normalizeFilter cleans values coming from a URL', () => {
  assert.deepStrictEqual(normalizeFilter('ict', 'computer-science'), { faculty: 'ict', program: 'computer-science' });
  assert.deepStrictEqual(normalizeFilter(undefined, 'accounting'), { faculty: 'business-communication', program: 'accounting' });
  assert.deepStrictEqual(normalizeFilter('ict', 'accounting'), { faculty: 'ict', program: '' });
  assert.deepStrictEqual(normalizeFilter('hogwarts', 'quidditch'), { faculty: '', program: '' });
  assert.deepStrictEqual(normalizeFilter(undefined, undefined), { faculty: '', program: '' });
});
