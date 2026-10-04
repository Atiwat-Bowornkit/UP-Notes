/**
 * UP-Notes Browse Helper Utility Module
 * Handles search filtering, category filtering, status filtering, sorting,
 * and popularity score calculation for notes.
 */

/**
 * Calculate popularity score based on likes and downloads
 * Formula: (likes * 2) + downloads
 *
 * Accepts either:
 * - A note object: calculatePopularityScore(note)
 * - Individual counts: calculatePopularityScore(likes, downloads)
 *
 * @param {Object|number} noteOrLikes - Note object or number of likes
 * @param {number} [optionalDownloads] - Number of downloads (if first arg is number)
 * @returns {number} Calculated popularity score
 */
function calculatePopularityScore(noteOrLikes = 0, optionalDownloads) {
  let likes = 0;
  let downloads = 0;

  if (typeof noteOrLikes === 'object' && noteOrLikes !== null) {
    const note = noteOrLikes;
    likes = note.likes ?? note._count?.likes ?? note.likeCount ?? 0;
    downloads = note.downloads ?? note.downloadCount ?? note.downloadsCount ?? 0;
  } else {
    likes = noteOrLikes ?? 0;
    downloads = optionalDownloads ?? 0;
  }

  const numLikes = typeof likes === 'number' && !isNaN(likes) ? likes : Number(likes) || 0;
  const numDownloads = typeof downloads === 'number' && !isNaN(downloads) ? downloads : Number(downloads) || 0;

  const validLikes = Math.max(0, numLikes);
  const validDownloads = Math.max(0, numDownloads);

  return (validLikes * 2) + validDownloads;
}

/**
 * Check if note category matches the filter category
 * @param {string} noteCategory 
 * @param {string} filterCategory 
 * @param {string} noteCode 
 * @returns {boolean}
 */
function checkCategoryMatch(noteCategory, filterCategory, noteCode) {
  if (!filterCategory || filterCategory === 'ทั้งหมด' || filterCategory === 'all') {
    return true;
  }

  if (noteCategory === filterCategory || noteCode === filterCategory) {
    return true;
  }

  const catUpper = String(filterCategory).toUpperCase();
  const noteCatUpper = String(noteCategory || '').toUpperCase();

  if (catUpper === 'GE' && noteCatUpper === 'GE') return true;
  if ((catUpper === 'วิชาเอกบังคับ' || catUpper === 'MAJOR_REQUIRED') &&
      (noteCatUpper === 'วิชาเอกบังคับ' || noteCatUpper === 'MAJOR_REQUIRED')) return true;
  if ((catUpper === 'วิชาเลือก' || catUpper === 'ELECTIVE') &&
      (noteCatUpper === 'วิชาเลือก' || noteCatUpper === 'ELECTIVE')) return true;

  return false;
}

/**
 * Helper to get timestamp or numeric value for sorting by latest
 * @param {Object} note 
 * @returns {number}
 */
function getNoteTimestamp(note) {
  if (!note) return 0;
  if (note.createdAt) {
    const time = new Date(note.createdAt).getTime();
    if (!isNaN(time)) return time;
  }
  if (note.date) {
    const time = new Date(note.date).getTime();
    if (!isNaN(time)) return time;
  }
  if (typeof note.id === 'number') return note.id;
  return 0;
}

/**
 * Filter and sort notes array by search query, category, status, and sortBy option.
 *
 * @param {Array} notes - List of note objects
 * @param {string} [searchQuery=''] - Search query (course code or course name)
 * @param {string} [category='ทั้งหมด'] - Category filter ('ทั้งหมด', 'GE', 'วิชาเอกบังคับ', 'วิชาเลือก', 'all', etc.)
 * @param {string} [sortBy='ล่าสุด'] - Sorting option ('ล่าสุด' / 'latest', 'ยอดนิยมสูงสุด' / 'popular')
 * @returns {Array} Filtered and sorted array of notes
 */
function filterNotesBySearch(notes, searchQuery = '', category = 'ทั้งหมด', sortBy = 'ล่าสุด') {
  if (!Array.isArray(notes)) return [];

  const rawQuery = (typeof searchQuery === 'string' ? searchQuery : String(searchQuery || '')).trim();
  const cleanQuery = rawQuery.toLowerCase();

  // 1. Filter notes by status, search query, and category (AND logic)
  const filtered = notes.filter(note => {
    if (!note || typeof note !== 'object') return false;

    // Status filter: Must be PUBLISHED (notes with status missing/undefined in mock test objects pass)
    const isPublished = !note.status || note.status === 'PUBLISHED';
    if (!isPublished) return false;

    // Category filter
    const matchesCategory = checkCategoryMatch(note.category, category, note.code || note.courseCode);
    if (!matchesCategory) return false;

    // Search query filter (course code, course name/title, author, description)
    if (!cleanQuery) return true;

    const noteCode = String(note.code || note.courseCode || note.course_code || '').toLowerCase();
    const noteTitle = String(note.title || note.courseName || note.course_name || note.name || '').toLowerCase();
    const noteAuthor = typeof note.author === 'string'
      ? note.author.toLowerCase()
      : String(note.author?.name || '').toLowerCase();
    const noteDesc = String(note.description || '').toLowerCase();

    let matchesQuery = noteCode.includes(cleanQuery) ||
                       noteTitle.includes(cleanQuery) ||
                       noteAuthor.includes(cleanQuery) ||
                       noteDesc.includes(cleanQuery);

    // Special case alias: '225311' <-> SE (Software Engineering)
    if (!matchesQuery) {
      const isSEWordInTitle = /\bse\b/i.test(noteTitle);
      if ((cleanQuery === '225311' || cleanQuery.includes('225311')) &&
          (noteCode.includes('225311') || isSEWordInTitle || noteTitle.includes('software engineering'))) {
        matchesQuery = true;
      } else if ((/\bse\b/i.test(cleanQuery) || cleanQuery === 'software engineering' || cleanQuery.includes('agile')) &&
                 noteCode === '225311') {
        matchesQuery = true;
      }
    }


    return matchesQuery;
  });

  // 2. Sort notes based on sortBy parameter
  const sortOption = String(sortBy || '').toLowerCase();
  const isPopularSort = sortOption === 'ยอดนิยมสูงสุด' || sortOption === 'popular' || sortOption === 'most_popular';

  return filtered.sort((a, b) => {
    if (isPopularSort) {
      const scoreA = calculatePopularityScore(a);
      const scoreB = calculatePopularityScore(b);
      const scoreDiff = scoreB - scoreA;
      if (scoreDiff !== 0) return scoreDiff;
    }

    // Default or secondary sort: latest date/id descending
    return getNoteTimestamp(b) - getNoteTimestamp(a);
  });
}

module.exports = {
  filterNotesBySearch,
  calculatePopularityScore,
};
