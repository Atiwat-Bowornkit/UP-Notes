/**
 * UP-Notes Helper Utility Module
 * Refactored clean code module replacing duplicated inline logic (DRY Principle)
 */

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg'];

/**
 * Validate note file for upload
 * @param {Object} file - File metadata object with name and size
 * @returns {Object} { isValid: boolean, error?: string }
 */
function validateUploadFile(file) {
    if (!file || !file.name) {
        return { isValid: false, error: 'กรุณาเลือกไฟล์เอกสารที่ต้องการอัปโหลด' };
    }
    if (typeof file.size !== 'number' || file.size < 0) {
        return { isValid: false, error: 'ขนาดไฟล์ไม่ถูกต้อง' };
    }

    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
        return { 
            isValid: false, 
            error: `นามสกุลไฟล์ไม่ถูกต้อง รองรับเฉพาะไฟล์ ${ALLOWED_EXTENSIONS.join(', ')} เท่านั้น` 
        };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
        return { isValid: false, error: 'ขนาดไฟล์เกินขีดจำกัดสูงสุด (ต้องไม่เกิน 10MB)' };
    }

    return { isValid: true };
}

/**
 * Filter notes array by search query and category (Pure Function)
 * @param {Array} notes - List of note objects
 * @param {string} query - Search keyword or course code
 * @param {string} category - Category or course filter
 * @returns {Array} Filtered list of notes
 */
function filterNotesBySearch(notes, query = '', category = 'all') {
    if (!Array.isArray(notes)) return [];
    
    const cleanQuery = query.trim().toLowerCase();
    
    return notes.filter(note => {
        const matchesCategory = (category === 'all' || note.category === category || note.code === category);
        const matchesQuery = !cleanQuery || 
            (note.title && note.title.toLowerCase().includes(cleanQuery)) ||
            (note.code && note.code.toLowerCase().includes(cleanQuery)) ||
            (note.author && note.author.toLowerCase().includes(cleanQuery));

        return matchesCategory && matchesQuery;
    });
}

/**
 * Calculate popularity score for sorting
 * @param {number} likes 
 * @param {number} downloads 
 * @returns {number} Score
 */
function calculatePopularityScore(likes = 0, downloads = 0) {
    return (likes * 2) + downloads;
}

module.exports = {
    validateUploadFile,
    filterNotesBySearch,
    calculatePopularityScore,
    MAX_FILE_SIZE_BYTES,
    ALLOWED_EXTENSIONS
};
