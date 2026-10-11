export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg'];

/**
 * ตรวจสอบความถูกต้องของไฟล์ตามกฎ US-03
 */
export function validateUploadFile(file) {
  if (!file) {
    return { valid: false, error: 'กรุณาเลือกไฟล์' };
  }

  // 1. ขนาดไฟล์ > 10MB
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'ขนาดไฟล์ต้องไม่เกิน 10MB' };
  }

  // 2. ตรวจสอบนามสกุลและประเภทไฟล์
  const fileName = file.name || '';
  const fileExt = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  const fileType = file.type ? file.type.toLowerCase() : '';

  const isExtValid = ALLOWED_EXTENSIONS.includes(fileExt);
  const isTypeValid = ALLOWED_MIME_TYPES.includes(fileType);

  if (!isExtValid || (!isTypeValid && fileType !== '')) {
    return { valid: false, error: 'รองรับเฉพาะไฟล์ PDF, PNG, JPG เท่านั้น' };
  }

  return { valid: true, error: null };
}

/**
 * ทำความสะอาดชื่อไฟล์ ป้องกันอักขระพิเศษ
 */
export function sanitizeFileName(fileName) {
  if (!fileName) return '';
  const ext = fileName.slice(fileName.lastIndexOf('.'));
  const baseName = fileName.slice(0, fileName.lastIndexOf('.'));
  const cleanBase = baseName
    .replace(/[^a-zA-Z0-9_\u0E00-\u0E7F-]/g, '-')
    .replace(/-+/g, '-');
  return `${cleanBase}${ext}`;
}

/**
 * ตรวจสอบรหัสวิชาตัวเลข 6 หลัก (เช่น 225311)
 */
export function validateCourseCode(code) {
  if (!code) return false;
  return /^\d{6}$/.test(code.trim());
}