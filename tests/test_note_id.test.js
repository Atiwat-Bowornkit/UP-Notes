/**
 * Unit Tests for notes/id.js Utility Module (Native Node.js Test Runner)
 */

const test = require('node:test');
const assert = require('node:assert');
const { getNoteByIdWithAccessControl } = require('../modules/notes/id');

test('notes/id.js - returns null for empty or missing noteId', async () => {
    assert.strictEqual(await getNoteByIdWithAccessControl(null), null);
    assert.strictEqual(await getNoteByIdWithAccessControl(''), null);
});

test('notes/id.js - returns note if status is PUBLISHED', async () => {
    const mockPrisma = {
        note: {
            findUnique: async () => ({
                id: '1',
                title: 'SE Note',
                status: 'PUBLISHED',
                authorId: 'user-1',
            }),
        },
    };

    const note = await getNoteByIdWithAccessControl('1', null, mockPrisma);
    assert.strictEqual(note.id, '1');
    assert.strictEqual(note.status, 'PUBLISHED');
});

test('notes/id.js - returns null for PENDING_REVIEW note if user is unauthenticated or not owner/admin', async () => {
    const mockPrisma = {
        note: {
            findUnique: async () => ({
                id: '2',
                title: 'Pending Note',
                status: 'PENDING_REVIEW',
                authorId: 'user-owner',
            }),
        },
    };

    // Unauthenticated user
    assert.strictEqual(await getNoteByIdWithAccessControl('2', null, mockPrisma), null);

    // Other non-owner user
    const otherUser = { id: 'user-other', role: 'USER' };
    assert.strictEqual(await getNoteByIdWithAccessControl('2', otherUser, mockPrisma), null);
});

test('notes/id.js - allows PENDING_REVIEW note for owner or admin', async () => {
    const mockPrisma = {
        note: {
            findUnique: async () => ({
                id: '2',
                title: 'Pending Note',
                status: 'PENDING_REVIEW',
                authorId: 'user-owner',
            }),
        },
    };

    // Owner user
    const ownerUser = { id: 'user-owner', role: 'USER' };
    const ownerResult = await getNoteByIdWithAccessControl('2', ownerUser, mockPrisma);
    assert.strictEqual(ownerResult.id, '2');

    // Admin user
    const adminUser = { id: 'admin-1', role: 'ADMIN' };
    const adminResult = await getNoteByIdWithAccessControl('2', adminUser, mockPrisma);
    assert.strictEqual(adminResult.id, '2');
});
