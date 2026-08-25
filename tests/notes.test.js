/**
 * Unit Tests for UP-Notes Helper Utility Module (Native Node.js Test Runner)
 */

const test = require('node:test');
const assert = require('node:assert');
const { 
    validateUploadFile, 
    filterNotesBySearch, 
    calculatePopularityScore 
} = require('../src/utils/notesHelper');

test('UP-Notes Unit Tests - validateUploadFile valid PDF', () => {
    const file = { name: 'summary.pdf', size: 5 * 1024 * 1024 };
    const result = validateUploadFile(file);
    assert.strictEqual(result.isValid, true);
});

test('UP-Notes Unit Tests - validateUploadFile size limit 10MB', () => {
    const file = { name: 'large_summary.pdf', size: 15 * 1024 * 1024 };
    const result = validateUploadFile(file);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.error.includes('10MB'));
});

test('UP-Notes Unit Tests - validateUploadFile invalid extension', () => {
    const file = { name: 'script.exe', size: 1 * 1024 * 1024 };
    const result = validateUploadFile(file);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.error.includes('นามสกุลไฟล์ไม่ถูกต้อง'));
});

test('UP-Notes Unit Tests - filterNotesBySearch by course code', () => {
    const sampleNotes = [
        { id: 1, code: '225311', title: 'สรุปเตรียมสอบ SE — Agile', author: 'Kankluay', category: '225311' },
        { id: 2, code: '225211', title: 'สรุปสอบกลางภาค Algo', author: 'Boss', category: '225211' }
    ];
    const filtered = filterNotesBySearch(sampleNotes, '225311', 'all');
    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].code, '225311');
});

test('UP-Notes Unit Tests - calculatePopularityScore', () => {
    const score = calculatePopularityScore(10, 20); // (10 * 2) + 20 = 40
    assert.strictEqual(score, 40);
});
