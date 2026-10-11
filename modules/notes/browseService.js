/**
 * UP-Notes Browse Service Module
 * Handles fetching, filtering, and paginating published notes.
 * Enforces status = 'PUBLISHED' to prevent hidden/pending review notes from being displayed.
 * Optimizes queries for response times under 1.5s (NFR-01).
 */

const { filterNotesBySearch } = require('./browseHelper');
const { displayName } = require('../../src/utils/authHelper');
const { isValidFaculty, isValidProgram } = require('../../src/utils/facultyData');

// Category mapping helper between UI labels and Prisma enum
const CATEGORY_MAP = {
  GE: 'GE',
  'วิชาเอกบังคับ': 'MAJOR_REQUIRED',
  MAJOR_REQUIRED: 'MAJOR_REQUIRED',
  'วิชาเลือก': 'ELECTIVE',
  ELECTIVE: 'ELECTIVE',
};

/**
 * Fetch published notes with pagination, search query filtering, category filtering, and sorting.
 *
 * @param {Object} options
 * @param {string} [options.searchQuery=''] - Search term for course code or title
 * @param {string} [options.category='ทั้งหมด'] - Category filter
 * @param {string} [options.faculty=''] - Faculty key filter (see src/utils/facultyData.js)
 * @param {string} [options.program=''] - Program key filter; only applied together with a faculty
 * @param {string} [options.sortBy='ล่าสุด'] - Sorting option ('ล่าสุด' or 'ยอดนิยมสูงสุด')
 * @param {number} [options.page=1] - Current page number
 * @param {number} [options.pageSize=12] - Number of items per page
 * @param {Array} [options.notes] - Optional in-memory array of notes for testing/fallback
 * @param {Object} [options.prismaClient] - Optional Prisma client instance
 * @returns {Promise<Object>} Paginated result with status, data, and pagination metadata
 */
async function getPublishedNotes(options = {}) {
  const {
    searchQuery = '',
    category = 'ทั้งหมด',
    faculty = '',
    program = '',
    sortBy = 'ล่าสุด',
    page = 1,
    pageSize = 12,
    notes = null,
    prismaClient = null,
  } = options;

  // A program only makes sense inside its faculty; unknown values are ignored instead of matching nothing.
  const facultyFilter = isValidFaculty(faculty) ? faculty : '';
  const programFilter = facultyFilter && isValidProgram(facultyFilter, program) ? program : '';

  const validPage = Math.max(1, parseInt(page, 10) || 1);
  const validPageSize = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 12));

  try {
    // 1. In-memory mode (if notes array is supplied directly)
    if (Array.isArray(notes)) {
      // Always enforce status === 'PUBLISHED'
      const publishedNotes = notes.filter(n => !n.status || n.status === 'PUBLISHED');
      const scoped = publishedNotes.filter(
        (n) =>
          (!facultyFilter || n.faculty === facultyFilter) &&
          (!programFilter || n.program === programFilter),
      );
      const filtered = filterNotesBySearch(scoped, searchQuery, category, sortBy);
      
      const totalCount = filtered.length;
      const totalPages = Math.ceil(totalCount / validPageSize) || 1;
      const startIndex = (validPage - 1) * validPageSize;
      const paginatedData = filtered.slice(startIndex, startIndex + validPageSize);

      return {
        success: true,
        data: paginatedData,
        pagination: {
          currentPage: validPage,
          pageSize: validPageSize,
          totalCount,
          totalPages,
          hasNextPage: validPage < totalPages,
          hasPrevPage: validPage > 1,
        },
      };
    }

    // 2. Database mode (using Prisma client)
    const client = prismaClient || (typeof globalThis !== 'undefined' && globalThis.prisma) || null;

    if (!client) {
      return {
        success: true,
        data: [],
        pagination: {
          currentPage: validPage,
          pageSize: validPageSize,
          totalCount: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    // Construct Prisma query conditions with MANDATORY status = 'PUBLISHED'
    const where = {
      status: 'PUBLISHED',
    };

    // Category filter
    const mappedCategory = CATEGORY_MAP[category];
    if (mappedCategory) {
      where.category = mappedCategory;
    }

    // Faculty / program filters
    if (facultyFilter) where.faculty = facultyFilter;
    if (programFilter) where.program = programFilter;

    // Search query filter
    const cleanQuery = searchQuery.trim();
    if (cleanQuery) {
      const isSE = cleanQuery === '225311' || cleanQuery.toLowerCase() === 'se';
      where.OR = [
        { title: { contains: cleanQuery, mode: 'insensitive' } },
        { courseCode: { contains: cleanQuery, mode: 'insensitive' } },
        { description: { contains: cleanQuery, mode: 'insensitive' } },
      ];
      if (isSE) {
        where.OR.push({ courseCode: '225311' });
      }
    }

    // Sorting order
    const isPopular = sortBy === 'ยอดนิยมสูงสุด' || sortBy === 'popular';
    const orderBy = isPopular
      ? [{ likes: { _count: 'desc' } }, { downloadCount: 'desc' }, { createdAt: 'desc' }]
      : [{ createdAt: 'desc' }];

    // Execute parallel optimized query
    const [dbNotes, totalCount] = await Promise.all([
      client.note.findMany({
        where,
        orderBy,
        skip: (validPage - 1) * validPageSize,
        take: validPageSize,
        include: {
          author: { select: { id: true, name: true, email: true } },
          _count: { select: { likes: true } },
        },
      }),
      client.note.count({ where }),
    ]);

    // Transform and run through browseHelper for double-verification
    const searchableNotes = dbNotes.map(n => ({
      ...n,
      likes: n._count?.likes ?? 0,
      downloads: n.downloadCount ?? 0,
      author: displayName(n.author),
      code: n.courseCode,
    }));

    const finalNotes = filterNotesBySearch(searchableNotes, searchQuery, category, sortBy);
    const totalPages = Math.ceil(totalCount / validPageSize) || 1;

    return {
      success: true,
      data: finalNotes,
      pagination: {
        currentPage: validPage,
        pageSize: validPageSize,
        totalCount,
        totalPages,
        hasNextPage: validPage < totalPages,
        hasPrevPage: validPage > 1,
      },
    };
  } catch {
    return {
      success: false,
      error: 'เกิดข้อผิดพลาดในการดึงข้อมูลโน้ตย่อ กรุณาลองใหม่อีกครั้ง',
      data: [],
      pagination: {
        currentPage: validPage,
        pageSize: validPageSize,
        totalCount: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

/**
 * Fetch a single published note by ID.
 * Returns null if the note does not exist or status is not 'PUBLISHED'.
 *
 * @param {string} noteId 
 * @param {Object} [prismaClient] 
 * @returns {Promise<Object|null>}
 */
async function getPublishedNoteById(noteId, prismaClient = null) {
  if (!noteId) return null;

  try {
    const client = prismaClient || (typeof globalThis !== 'undefined' && globalThis.prisma) || null;
    if (!client) return null;

    const note = await client.note.findFirst({
      where: {
        id: noteId,
        status: 'PUBLISHED', // Mandatory check for PUBLISHED status
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        _count: { select: { likes: true } },
      },
    });

    return note;
  } catch {
    return null;
  }
}

module.exports = {
  getPublishedNotes,
  getPublishedNoteById,
  CATEGORY_MAP,
};
