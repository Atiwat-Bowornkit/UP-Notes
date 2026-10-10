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
