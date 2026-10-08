/**
 * Unit Tests for browseHelper Utility Module (Native Node.js Test Runner)
 */

const test = require('node:test');
const assert = require('node:assert');
const { filterNotesBySearch, calculatePopularityScore } = require('../src/utils/browseHelper');

test('browseHelper - calculatePopularityScore with numbers', () => {
    assert.strictEqual(calculatePopularityScore(10, 20), 40); // 10*2 + 20 = 40
    assert.strictEqual(calculatePopularityScore(0, 0), 0);
    assert.strictEqual(calculatePopularityScore(5), 10);
});

test('browseHelper - calculatePopularityScore with note object', () => {
    assert.strictEqual(calculatePopularityScore({ likes: 10, downloads: 20 }), 40);
    assert.strictEqual(calculatePopularityScore({ likes: 5, downloadCount: 15 }), 25);
    assert.strictEqual(calculatePopularityScore({ _count: { likes: 7 }, downloadCount: 6 }), 20);
    assert.strictEqual(calculatePopularityScore(null), 0);
    assert.strictEqual(calculatePopularityScore({}), 0);
});

test('browseHelper - filterNotesBySearch by course code 225311 finds SE note', () => {
    const sampleNotes = [
        { id: 1, code: '225311', title: 'สรุปเตรียมสอบ SE — Agile', author: 'Kankluay', category: 'วิชาเอกบังคับ', status: 'PUBLISHED' },
        { id: 2, code: '225211', title: 'สรุปสอบกลางภาค Algo', author: 'Boss', category: 'วิชาเอกบังคับ', status: 'PUBLISHED' }
    ];
    const result = filterNotesBySearch(sampleNotes, '225311', 'ทั้งหมด');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].code, '225311');
});

test('browseHelper - filterNotesBySearch with category AND filter', () => {
    const sampleNotes = [
        { id: 1, code: '225311', title: 'สรุป SE บทที่ 1', category: 'วิชาเอกบังคับ', status: 'PUBLISHED' },
        { id: 2, code: '225311', title: 'สรุป SE บทที่ 2', category: 'วิชาเลือก', status: 'PUBLISHED' },
        { id: 3, code: '100101', title: 'สรุป GE ภาษาไทย', category: 'GE', status: 'PUBLISHED' }
    ];
    const filtered = filterNotesBySearch(sampleNotes, '225311', 'วิชาเอกบังคับ');
    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].id, 1);
});

test('browseHelper - filterNotesBySearch filters out non-PUBLISHED notes', () => {
    const sampleNotes = [
        { id: 1, code: '225311', title: 'สรุป SE 1', status: 'PUBLISHED' },
        { id: 2, code: '225311', title: 'สรุป SE 2', status: 'PENDING_REVIEW' },
        { id: 3, code: '225311', title: 'สรุป SE 3', status: 'DRAFT' }
    ];
    const filtered = filterNotesBySearch(sampleNotes, '225311', 'ทั้งหมด');
    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].id, 1);
});

test('browseHelper - filterNotesBySearch sorting by popular (ยอดนิยมสูงสุด)', () => {
    const sampleNotes = [
        { id: 1, code: '225311', title: 'Note Low', likes: 2, downloads: 5, status: 'PUBLISHED' },
        { id: 2, code: '225311', title: 'Note High', likes: 50, downloads: 100, status: 'PUBLISHED' },
        { id: 3, code: '225311', title: 'Note Mid', likes: 10, downloads: 20, status: 'PUBLISHED' }
    ];
    const sorted = filterNotesBySearch(sampleNotes, '', 'ทั้งหมด', 'ยอดนิยมสูงสุด');
    assert.strictEqual(sorted[0].id, 2);
    assert.strictEqual(sorted[1].id, 3);
    assert.strictEqual(sorted[2].id, 1);
});

test('browseHelper - filterNotesBySearch sorting by latest (ล่าสุด)', () => {
    const sampleNotes = [
        { id: 1, code: '225311', title: 'Old Note', createdAt: '2026-01-01T00:00:00Z', status: 'PUBLISHED' },
        { id: 2, code: '225311', title: 'New Note', createdAt: '2026-10-04T00:00:00Z', status: 'PUBLISHED' }
    ];
    const sorted = filterNotesBySearch(sampleNotes, '', 'ทั้งหมด', 'ล่าสุด');
    assert.strictEqual(sorted[0].id, 2);
    assert.strictEqual(sorted[1].id, 1);
});

test('browseHelper - handles edge cases (null, undefined, non-array)', () => {
    assert.deepStrictEqual(filterNotesBySearch(null), []);
    assert.deepStrictEqual(filterNotesBySearch(undefined), []);
    assert.deepStrictEqual(filterNotesBySearch("not-an-array"), []);
    assert.deepStrictEqual(filterNotesBySearch([], null, null, null), []);
});
