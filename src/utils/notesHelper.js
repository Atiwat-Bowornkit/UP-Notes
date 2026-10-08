const browseHelper = require('./browseHelper');

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

module.exports = {
    validateUploadFile,
    filterNotesBySearch: browseHelper.filterNotesBySearch,
    calculatePopularityScore: browseHelper.calculatePopularityScore,
    MAX_FILE_SIZE_BYTES,
    ALLOWED_EXTENSIONS
};

