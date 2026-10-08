/**
 * Lab 9 — Step 5B: Mutation Testing (Stryker)
 * Target function: filterNotesBySearch (src/utils/notesHelper.js)
 */

const test = require('node:test');
const assert = require('node:assert');
const { filterNotesBySearch, validateUploadFile, ALLOWED_EXTENSIONS } = require('../src/utils/notesHelper');

const notes = [
    { id: 1, code: 'CS101', title: 'Intro to Testing', author: 'Alice', category: 'CS' },
    { id: 2, code: 'CS102', title: 'Advanced Testing', author: 'Bob', category: 'CS' },
    { id: 3, code: 'MA201', title: 'Calculus Notes', author: 'Carol', category: 'MATH' },
    { id: 4, category: 'CS' } // ตั้งใจให้ข้อมูลแหว่งเพื่อเทสต์ edge case
];

// Kill: query.trim() removal
test('filterNotesBySearch - ignores surrounding whitespace in query', () => {
    const result = filterNotesBySearch(notes, '  cs101  ', 'all');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, 1);
});

// Kill: category match logic / mutants
test('filterNotesBySearch - filters by exact category', () => {
    const result = filterNotesBySearch(notes, '', 'MATH');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, 3);
});

// Kill: note.code === category mutants
test('filterNotesBySearch - falls back to matching category via note.code', () => {
    const result = filterNotesBySearch(notes, '', 'CS102');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, 2);
});

// Kill: !cleanQuery logical mutants
test('filterNotesBySearch - empty query returns all notes (even missing fields)', () => {
    const result = filterNotesBySearch(notes, '', 'all');
    assert.strictEqual(result.length, 4);
});

// Kill: title match & toLowerCase() mutants
test('filterNotesBySearch - case-insensitive match on title', () => {
    const result = filterNotesBySearch(notes, 'testing', 'all');
    assert.strictEqual(result.length, 2);
    assert.deepStrictEqual(result.map(n => n.id).sort(), [1, 2]);
});

// Kill: code match & toLowerCase() mutants
test('filterNotesBySearch - case-insensitive match on code', () => {
    const result = filterNotesBySearch(notes, 'cs102', 'all');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, 2);
});

// Kill: author match & toLowerCase() mutants
test('filterNotesBySearch - case-insensitive match on author', () => {
    const result = filterNotesBySearch(notes, 'carol', 'all');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, 3);
});

// Kill: Array.isArray() guard mutants
test('filterNotesBySearch - returns empty array for invalid input type', () => {
    const result = filterNotesBySearch('not-an-array', 'anything', 'all');
    assert.deepStrictEqual(result, []);
});

// Kill: default parameters mutants (query = '', category = 'all')
test('filterNotesBySearch - works normally without query and category arguments', () => {
    const result = filterNotesBySearch(notes);
    assert.strictEqual(result.length, notes.length, 'Should fallback to default args and return all notes');
});

// Kill: ALLOWED_EXTENSIONS.join() mutant
test('validateUploadFile - error message displays comma-separated extensions', () => {
    const result = validateUploadFile({ name: 'script.exe', size: 1024 });
    assert.ok(result.error.includes(ALLOWED_EXTENSIONS.join(', ')));
});

// --- เก็บตก Surviving Mutants (เขียนสไตล์รวบรัด) ---

// Kill: query.toLowerCase() removal mutant
test('filterNotesBySearch - handles mixed-case query correctly', () => {
    const result = filterNotesBySearch(notes, 'tEsTiNg', 'all');
    assert.strictEqual(result.length, 2, 'Should find notes regardless of query case');
});

// Kill: category === 'all' mutation (e.g. changed to category !== 'all')
test('filterNotesBySearch - returns empty if category does not match anything', () => {
    const result = filterNotesBySearch(notes, '', 'UNKNOWN_CATEGORY');
    assert.deepStrictEqual(result, []);
});

// Kill: size validation mutants (missed in original tests)
test('validateUploadFile - fails on missing or negative file size', () => {
    const res1 = validateUploadFile({ name: 'doc.pdf' });
    assert.strictEqual(res1.isValid, false);
    assert.strictEqual(res1.error, 'ขนาดไฟล์ไม่ถูกต้อง');
    const res2 = validateUploadFile({ name: 'doc.pdf', size: -100 });
    assert.strictEqual(res2.isValid, false);
    assert.strictEqual(res2.error, 'ขนาดไฟล์ไม่ถูกต้อง');
});