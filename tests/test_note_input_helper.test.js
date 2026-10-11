const test = require('node:test');
const assert = require('node:assert');
const { validateNoteFields, isValidCourseCode, NOTE_CATEGORIES } = require('../src/utils/noteInputHelper');

const ok = { title: ' Calculus ', courseCode: '225311', category: 'GE', description: ' notes ' };

test('validateNoteFields - valid input is trimmed and normalised', () => {
  const r = validateNoteFields(ok);
  assert.deepStrictEqual(r, {
    valid: true,
    data: { title: 'Calculus', courseCode: '225311', category: 'GE', description: 'notes' },
  });
});

test('validateNoteFields - blank description becomes null', () => {
  const r = validateNoteFields({ ...ok, description: '   ' });
  assert.strictEqual(r.data.description, null);
});

test('validateNoteFields - missing or whitespace title is rejected', () => {
  assert.strictEqual(validateNoteFields({ ...ok, title: '  ' }).valid, false);
  assert.strictEqual(validateNoteFields({ ...ok, title: undefined }).valid, false);
  assert.strictEqual(validateNoteFields({ ...ok, title: 123 }).valid, false);
});

test('validateNoteFields - every enum category is accepted, Thai labels are not', () => {
  for (const category of NOTE_CATEGORIES) {
    assert.strictEqual(validateNoteFields({ ...ok, category }).valid, true);
  }
  assert.strictEqual(validateNoteFields({ ...ok, category: 'วิชาเลือก' }).valid, false);
  assert.strictEqual(validateNoteFields({ ...ok, category: undefined }).valid, false);
});

test('validateNoteFields - course code must be exactly 6 digits', () => {
  assert.strictEqual(validateNoteFields({ ...ok, courseCode: '22531' }).valid, false);
  assert.strictEqual(validateNoteFields({ ...ok, courseCode: '2253111' }).valid, false);
  assert.strictEqual(validateNoteFields({ ...ok, courseCode: '22531a' }).valid, false);
  assert.strictEqual(validateNoteFields({ ...ok, courseCode: undefined }).valid, false);
  assert.strictEqual(validateNoteFields({ ...ok, courseCode: ' 225311 ' }).data.courseCode, '225311');
});

test('validateNoteFields - requireCourseCode:false skips course code (edit flow)', () => {
  const r = validateNoteFields({ title: 'x', category: 'ELECTIVE' }, { requireCourseCode: false });
  assert.strictEqual(r.valid, true);
  assert.strictEqual('courseCode' in r.data, false);
});

test('validateNoteFields - non-object input is rejected without throwing', () => {
  assert.strictEqual(validateNoteFields(null).valid, false);
  assert.strictEqual(validateNoteFields('x').valid, false);
});

test('isValidCourseCode - non-string input is false', () => {
  assert.strictEqual(isValidCourseCode(225311), false);
});

// ---- faculty / program ----
test('validateNoteFields - faculty is optional unless requireFaculty is set', () => {
  assert.strictEqual(validateNoteFields(ok).valid, true);
  assert.strictEqual('faculty' in validateNoteFields(ok).data, false);
  assert.strictEqual(validateNoteFields(ok, { requireFaculty: true }).valid, false);
  assert.strictEqual(validateNoteFields(ok, { requireFaculty: true }).error, 'กรุณาเลือกคณะ');
});

test('validateNoteFields - requireFaculty needs a program when the faculty has a program list', () => {
  const noProgram = validateNoteFields({ ...ok, faculty: 'ict' }, { requireFaculty: true });
  assert.strictEqual(noProgram.valid, false);
  assert.strictEqual(noProgram.error, 'กรุณาเลือกสาขา');

  const full = validateNoteFields({ ...ok, faculty: 'ict', program: 'software-engineering' }, { requireFaculty: true });
  assert.strictEqual(full.valid, true);
  assert.strictEqual(full.data.faculty, 'ict');
  assert.strictEqual(full.data.program, 'software-engineering');
});

test('validateNoteFields - faculty without a program list needs no program', () => {
  const r = validateNoteFields({ ...ok, faculty: 'law' }, { requireFaculty: true });
  assert.strictEqual(r.valid, true);
  assert.strictEqual(r.data.program, null);
});

test('validateNoteFields - rejects unknown faculty and a program of another faculty', () => {
  assert.strictEqual(validateNoteFields({ ...ok, faculty: 'hogwarts' }).valid, false);
  const wrong = validateNoteFields({ ...ok, faculty: 'ict', program: 'accounting' });
  assert.strictEqual(wrong.valid, false);
  assert.strictEqual(wrong.error, 'สาขาไม่ตรงกับคณะที่เลือก');
});

test('validateNoteFields - a program cannot be chosen without a faculty', () => {
  const r = validateNoteFields({ ...ok, program: 'accounting' });
  assert.strictEqual(r.valid, false);
  assert.strictEqual(r.error, 'กรุณาเลือกคณะก่อนเลือกสาขา');
});

test('validateNoteFields - edit flow: faculty keys are only returned when sent', () => {
  assert.strictEqual('faculty' in validateNoteFields({ title: 'x', category: 'GE' }, { requireCourseCode: false }).data, false);
  const cleared = validateNoteFields({ title: 'x', category: 'GE', faculty: null, program: null }, { requireCourseCode: false });
  assert.strictEqual(cleared.valid, true);
  assert.strictEqual(cleared.data.faculty, null);
});
