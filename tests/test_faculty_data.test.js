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
