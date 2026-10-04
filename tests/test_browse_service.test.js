/**
 * Unit Tests for browseService Utility Module (Native Node.js Test Runner)
 */

const test = require('node:test');
const assert = require('node:assert');
const { getPublishedNotes, getPublishedNoteById } = require('../modules/notes/browseService');

test('browseService - getPublishedNotes filters strictly by status = PUBLISHED', async () => {
    const mockNotes = [
        { id: '1', title: 'SE Summary', code: '225311', status: 'PUBLISHED', category: 'วิชาเอกบังคับ' },
        { id: '2', title: 'Algo Summary', code: '225211', status: 'PENDING_REVIEW', category: 'วิชาเอกบังคับ' },
        { id: '3', title: 'Draft Note', code: '100101', status: 'DRAFT', category: 'GE' },
    ];

    const result = await getPublishedNotes({ notes: mockNotes });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.data.length, 1);
    assert.strictEqual(result.data[0].id, '1');
    assert.strictEqual(result.pagination.totalCount, 1);
});

test('browseService - getPublishedNotes pagination metadata calculation', async () => {
    const mockNotes = Array.from({ length: 25 }, (_, i) => ({
        id: String(i + 1),
        title: `Note ${i + 1}`,
        code: '225311',
        status: 'PUBLISHED',
        category: 'วิชาเอกบังคับ',
    }));

    const page1 = await getPublishedNotes({ notes: mockNotes, page: 1, pageSize: 10 });
    assert.strictEqual(page1.data.length, 10);
    assert.strictEqual(page1.pagination.currentPage, 1);
    assert.strictEqual(page1.pagination.totalPages, 3);
    assert.strictEqual(page1.pagination.totalCount, 25);
    assert.strictEqual(page1.pagination.hasNextPage, true);
    assert.strictEqual(page1.pagination.hasPrevPage, false);

    const page3 = await getPublishedNotes({ notes: mockNotes, page: 3, pageSize: 10 });
    assert.strictEqual(page3.data.length, 5);
    assert.strictEqual(page3.pagination.currentPage, 3);
    assert.strictEqual(page3.pagination.hasNextPage, false);
    assert.strictEqual(page3.pagination.hasPrevPage, true);
});

test('browseService - getPublishedNotes search 225311 finds SE notes', async () => {
    const mockNotes = [
        { id: '1', title: 'Software Engineering Agile', code: '225311', status: 'PUBLISHED' },
        { id: '2', title: 'Database Systems', code: '225200', status: 'PUBLISHED' },
    ];

    const result = await getPublishedNotes({ notes: mockNotes, searchQuery: '225311' });
    assert.strictEqual(result.data.length, 1);
    assert.strictEqual(result.data[0].code, '225311');
});

test('browseService - getPublishedNotes popularity sorting', async () => {
    const mockNotes = [
        { id: '1', title: 'Low Note', likes: 2, downloads: 1, status: 'PUBLISHED' },
        { id: '2', title: 'High Note', likes: 20, downloads: 50, status: 'PUBLISHED' },
    ];

    const result = await getPublishedNotes({ notes: mockNotes, sortBy: 'ยอดนิยมสูงสุด' });
    assert.strictEqual(result.data[0].id, '2');
    assert.strictEqual(result.data[1].id, '1');
});

test('browseService - getPublishedNoteById handles missing or unpublished notes', async () => {
    assert.strictEqual(await getPublishedNoteById(null), null);
    assert.strictEqual(await getPublishedNoteById('non-existent'), null);
});
