/**
 * Server-side validation for note metadata (upload + edit). CommonJS so node:test can load it.
 */

const { isValidFaculty, isValidProgram, getPrograms } = require('./facultyData');

const NOTE_CATEGORIES = ['GE', 'MAJOR_REQUIRED', 'ELECTIVE'];

function isValidCourseCode(code) {
  return typeof code === 'string' && /^\d{6}$/.test(code.trim());
}

/**
 * @param {{title?: unknown, courseCode?: unknown, category?: unknown, description?: unknown,
 *   faculty?: unknown, program?: unknown}} input
 * @param {{requireCourseCode?: boolean, requireFaculty?: boolean}} [options]
 *   requireFaculty: upload flow — faculty is mandatory, and so is the program when the faculty has a list.
 *   When it is false (edit flow), faculty/program are only validated and returned if the caller sent them.
 * @returns {{valid: true, data: object} | {valid: false, error: string}}
 */
function validateNoteFields(input, { requireCourseCode = true, requireFaculty = false } = {}) {
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

  const sent = (key) => Object.prototype.hasOwnProperty.call(src, key);
  if (requireFaculty || sent('faculty') || sent('program')) {
    const faculty = typeof src.faculty === 'string' ? src.faculty.trim() : '';
    const program = typeof src.program === 'string' ? src.program.trim() : '';

    if (!faculty) {
      if (requireFaculty) return { valid: false, error: 'กรุณาเลือกคณะ' };
      if (program) return { valid: false, error: 'กรุณาเลือกคณะก่อนเลือกสาขา' };
    } else {
      if (!isValidFaculty(faculty)) return { valid: false, error: 'คณะไม่ถูกต้อง' };
      if (program) {
        if (!isValidProgram(faculty, program)) {
          return { valid: false, error: 'สาขาไม่ตรงกับคณะที่เลือก' };
        }
      } else if (requireFaculty && getPrograms(faculty).length > 0) {
        return { valid: false, error: 'กรุณาเลือกสาขา' };
      }
    }

    data.faculty = faculty || null;
    data.program = program || null;
  }

  return { valid: true, data };
}

module.exports = { NOTE_CATEGORIES, isValidCourseCode, validateNoteFields };
