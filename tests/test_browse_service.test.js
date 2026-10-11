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

// ---- faculty / program filters ----
const facultyNotes = [
    { id: '1', title: 'SE', status: 'PUBLISHED', faculty: 'ict', program: 'software-engineering' },
    { id: '2', title: 'CS', status: 'PUBLISHED', faculty: 'ict', program: 'computer-science' },
    { id: '3', title: 'Acc', status: 'PUBLISHED', faculty: 'business-communication', program: 'accounting' },
    { id: '4', title: 'Law', status: 'PUBLISHED', faculty: 'law', program: null },
    { id: '5', title: 'Old note', status: 'PUBLISHED' },
    { id: '6', title: 'Hidden ICT', status: 'HIDDEN', faculty: 'ict', program: 'software-engineering' },
];

test('browseService - faculty filter keeps only that faculty (and never hidden notes)', async () => {
    const result = await getPublishedNotes({ notes: facultyNotes, faculty: 'ict' });
    assert.deepStrictEqual(result.data.map((n) => n.id).sort(), ['1', '2']);
});

test('browseService - program filter narrows within the faculty', async () => {
    const result = await getPublishedNotes({ notes: facultyNotes, faculty: 'ict', program: 'computer-science' });
    assert.deepStrictEqual(result.data.map((n) => n.id), ['2']);
});

test('browseService - a program works alone and implies its faculty', async () => {
    const result = await getPublishedNotes({ notes: facultyNotes, program: 'accounting' });
    assert.deepStrictEqual(result.data.map((n) => n.id), ['3']);
});

test('browseService - a program that contradicts the chosen faculty is ignored (faculty wins)', async () => {
    const result = await getPublishedNotes({ notes: facultyNotes, faculty: 'ict', program: 'accounting' });
    assert.deepStrictEqual(result.data.map((n) => n.id).sort(), ['1', '2']);
});

test('browseService - unknown program is ignored', async () => {
    const result = await getPublishedNotes({ notes: facultyNotes, program: 'quidditch' });
    assert.strictEqual(result.pagination.totalCount, 5);
});

test('browseService - unknown faculty is ignored instead of matching nothing', async () => {
    const result = await getPublishedNotes({ notes: facultyNotes, faculty: 'hogwarts' });
    assert.strictEqual(result.pagination.totalCount, 5);
});

test('browseService - faculty filter combines with search', async () => {
    const result = await getPublishedNotes({ notes: facultyNotes, faculty: 'ict', searchQuery: 'SE' });
    assert.deepStrictEqual(result.data.map((n) => n.id), ['1']);
});

test('browseService - database mode passes faculty/program into the Prisma where clause', async () => {
    let seenWhere;
    const prismaClient = {
        note: {
            findMany: async ({ where }) => { seenWhere = where; return []; },
            count: async () => 0,
        },
    };
    await getPublishedNotes({ prismaClient, faculty: 'ict', program: 'software-engineering' });
    assert.strictEqual(seenWhere.status, 'PUBLISHED');
    assert.strictEqual(seenWhere.faculty, 'ict');
    assert.strictEqual(seenWhere.program, 'software-engineering');

    // program alone: the faculty is derived from it
    await getPublishedNotes({ prismaClient, program: 'software-engineering' });
    assert.strictEqual(seenWhere.faculty, 'ict');
    assert.strictEqual(seenWhere.program, 'software-engineering');

    await getPublishedNotes({ prismaClient, faculty: '', program: 'quidditch' });
    assert.strictEqual('faculty' in seenWhere, false);
    assert.strictEqual('program' in seenWhere, false);
});
