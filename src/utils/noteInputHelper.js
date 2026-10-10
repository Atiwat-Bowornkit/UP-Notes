/**
 * Server-side validation for note metadata (upload + edit). CommonJS so node:test can load it.
 */

const NOTE_CATEGORIES = ['GE', 'MAJOR_REQUIRED', 'ELECTIVE'];

function isValidCourseCode(code) {
  return typeof code === 'string' && /^\d{6}$/.test(code.trim());
}

/**
 * @param {{title?: unknown, courseCode?: unknown, category?: unknown, description?: unknown}} input
 * @param {{requireCourseCode?: boolean}} [options]
 * @returns {{valid: true, data: object} | {valid: false, error: string}}
 */
function validateNoteFields(input, { requireCourseCode = true } = {}) {
  const src = input && typeof input === 'object' ? input : {};
  const title = typeof src.title === 'string' ? src.title.trim() : '';
  const description = typeof src.description === 'string' ? src.description.trim() : '';

  if (!title) return { valid: false, error: 'กรุณากรอกชื่อเรื่อง' };
  if (!NOTE_CATEGORIES.includes(src.category)) {
    return { valid: false, error: 'หมวดหมู่ไม่ถูกต้อง' };
  }

  const data = { title, category: src.category, description: description || null };

  if (requireCourseCode) {
    if (!isValidCourseCode(src.courseCode)) {
      return { valid: false, error: 'รหัสวิชาต้องเป็นตัวเลข 6 หลัก' };
    }
    data.courseCode = src.courseCode.trim();
  }

  return { valid: true, data };
}

module.exports = { NOTE_CATEGORIES, isValidCourseCode, validateNoteFields };
