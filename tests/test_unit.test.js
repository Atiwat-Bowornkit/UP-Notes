/**
 * Lab 9 — Step 1: Unit Test Workshop
 * Target function: validateUploadFile (src/utils/notesHelper.js)
 * Technique: Equivalence Partitioning + Boundary Value Analysis
 */

const test = require('node:test');
const assert = require('node:assert');
const { validateUploadFile, MAX_FILE_SIZE_BYTES } = require('../src/utils/notesHelper');

// ==========================================
// Invalid Inputs & Edge Cases (EP1, EP3, EP4, EP7, EP8)
// ==========================================

test('validateUploadFile - missing file object returns invalid', () => {
    const result = validateUploadFile(null);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.error.includes('กรุณาเลือกไฟล์'));
});

test('validateUploadFile - disallowed extension (.exe) returns invalid', () => {
    const result = validateUploadFile({ name: 'script.exe', size: 1024 });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.error.includes('นามสกุลไฟล์ไม่ถูกต้อง'));
});

test('validateUploadFile - size strictly above 10MB limit returns invalid', () => {
    const result = validateUploadFile({ name: 'large_summary.pdf', size: 15 * 1024 * 1024 });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.error.includes('10MB'));
});

test('validateUploadFile - negative or undefined size returns invalid', () => {
    assert.strictEqual(validateUploadFile({ name: 'doc.pdf', size: -100 }).isValid, false, 'Negative size should fail');
    assert.strictEqual(validateUploadFile({ name: 'doc.pdf' }).isValid, false, 'Undefined size should fail');
});

test('validateUploadFile - filename without extension returns invalid', () => {
    const result = validateUploadFile({ name: 'README', size: 1024 });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.error.includes('นามสกุลไฟล์ไม่ถูกต้อง'));
});


// ==========================================
// Valid Inputs & Happy Paths (EP2, EP5, EP6, EP9)
// ==========================================

test('validateUploadFile - valid PDF within size limit passes', () => {
    const result = validateUploadFile({ name: 'summary.pdf', size: 5 * 1024 * 1024 });
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.error, undefined);
});

test('validateUploadFile - extension check is case-insensitive', () => {
    assert.strictEqual(validateUploadFile({ name: 'NOTES.PDF', size: 1024 }).isValid, true);
});

test('validateUploadFile - accepts all explicitly allowed extensions', () => {
    const allowed = ['photo.png', 'photo.jpg', 'photo.jpeg'];
    for (const name of allowed) {
        assert.strictEqual(validateUploadFile({ name, size: 1024 }).isValid, true, `${name} should be valid`);
    }
});

test('validateUploadFile - handles multiple dots in filename correctly', () => {
    // นามสกุลที่แท้จริงคือส่วนสุดท้าย (.pdf)
    assert.strictEqual(validateUploadFile({ name: 'my.notes.v2.pdf', size: 1024 }).isValid, true);
});


// ==========================================
// Boundary Value Analysis
// ==========================================

test('validateUploadFile - lower boundary: 0 bytes passes', () => {
    assert.strictEqual(validateUploadFile({ name: 'empty.png', size: 0 }).isValid, true);
});

test('validateUploadFile - upper boundary: exactly MAX_FILE_SIZE_BYTES passes', () => {
    assert.strictEqual(validateUploadFile({ name: 'exact.pdf', size: MAX_FILE_SIZE_BYTES }).isValid, true);
});

test('validateUploadFile - upper boundary + 1: MAX_FILE_SIZE_BYTES + 1 fails', () => {
    const result = validateUploadFile({ name: 'over.pdf', size: MAX_FILE_SIZE_BYTES + 1 });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.error.includes('10MB'));
});