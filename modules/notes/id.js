/**
 * UP-Notes Note Detail Utility & Service Module (notes/id.js)
 * Handles note retrieval by ID with Access Control checks for PUBLISHED vs PENDING_REVIEW notes.
 */

const { getPublishedNoteById } = require('./browseService');

/**
 * Get note detail by ID with Access Control enforcement.
 * - If status is PUBLISHED -> Allowed for anyone
 * - If status is PENDING_REVIEW or other -> Only allowed if currentUser is author or admin
 * - Otherwise -> returns null
 *
 * @param {string} noteId 
 * @param {Object} [currentUser=null] - Object with { id, role }
 * @param {Object} [prismaClient=null] 
 * @returns {Promise<Object|null>} Note detail object or null
 */
async function getNoteByIdWithAccessControl(noteId, currentUser = null, prismaClient = null) {
  if (!noteId) return null;

  try {
    const client = prismaClient || (typeof globalThis !== 'undefined' && globalThis.prisma) || null;
    if (!client) return null;

    const note = await client.note.findUnique({
      where: { id: noteId },
      include: {
        author: { select: { id: true, name: true } },
        _count: { select: { likes: true } },
      },
    });

    if (!note) return null;

    // Access control rule: PENDING_REVIEW notes can only be viewed by owner or admin
    if (note.status !== 'PUBLISHED') {
      const isOwner = currentUser && currentUser.id === note.authorId;
      const isAdmin = currentUser && currentUser.role === 'ADMIN';
      if (!isOwner && !isAdmin) {
        return null;
      }
    }

    return note;
  } catch {
    return null;
  }
}

module.exports = {
  getNoteByIdWithAccessControl,
  getPublishedNoteById,
};
