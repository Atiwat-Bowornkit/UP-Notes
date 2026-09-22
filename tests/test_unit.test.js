/**
 * Lab 9 — Step 1: Unit Test Workshop
 * Target function: validateUploadFile (src/utils/notesHelper.js)
 * Technique: Equivalence Partitioning + Boundary Value Analysis, Arrange-Act-Assert (AAA)
 */

const test = require('node:test');
const assert = require('node:assert');
const { validateUploadFile, MAX_FILE_SIZE_BYTES } = require('../src/utils/notesHelper');

// Partition 1: missing file / missing name (invalid input)
test('validateUploadFile - EP1: no file provided -> invalid', () => {
    // Arrange
    const file = null;

    // Act
    const result = validateUploadFile(file);

    // Assert
    assert.strictEqual(result.isValid, false);
    assert.ok(result.error.includes('กรุณาเลือกไฟล์'));
});

// Partition 2: valid extension + size well within limit (happy path)
test('validateUploadFile - EP2: valid PDF within size limit -> valid', () => {
    // Arrange
    const file = { name: 'summary.pdf', size: 5 * 1024 * 1024 };

    // Act
    const result = validateUploadFile(file);

    // Assert
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.error, undefined);
});

// Partition 3: extension outside the allow-list
test('validateUploadFile - EP3: disallowed extension (.exe) -> invalid', () => {
    // Arrange
    const file = { name: 'script.exe', size: 1 * 1024 * 1024 };

    // Act
    const result = validateUploadFile(file);

    // Assert
    assert.strictEqual(result.isValid, false);
    assert.ok(result.error.includes('นามสกุลไฟล์ไม่ถูกต้อง'));
});

// Partition 4: file too large
test('validateUploadFile - EP4: size above 10MB limit -> invalid', () => {
    // Arrange
    const file = { name: 'large_summary.pdf', size: 15 * 1024 * 1024 };

    // Act
    const result = validateUploadFile(file);

    // Assert
    assert.strictEqual(result.isValid, false);
    assert.ok(result.error.includes('10MB'));
});

// Partition 5: extension check is case-insensitive
test('validateUploadFile - EP5: uppercase extension (.PDF) -> valid', () => {
    // Arrange
    const file = { name: 'NOTES.PDF', size: 1024 };

    // Act
    const result = validateUploadFile(file);

    // Assert
    assert.strictEqual(result.isValid, true);
});

// Boundary 1 (lower): zero-byte file is still within the size limit
test('validateUploadFile - Boundary: 0 bytes -> valid (lower size boundary)', () => {
    // Arrange
    const file = { name: 'empty.png', size: 0 };

    // Act
    const result = validateUploadFile(file);

    // Assert
    assert.strictEqual(result.isValid, true);
});

// Boundary 2: exactly at MAX_FILE_SIZE_BYTES (10MB) must still pass (check is strictly ">")
test('validateUploadFile - Boundary: size == MAX_FILE_SIZE_BYTES exactly -> valid', () => {
    // Arrange
    const file = { name: 'exact.pdf', size: MAX_FILE_SIZE_BYTES };

    // Act
    const result = validateUploadFile(file);

    // Assert
    assert.strictEqual(result.isValid, true);
});

// Boundary 3: one byte over MAX_FILE_SIZE_BYTES must fail
test('validateUploadFile - Boundary: size == MAX_FILE_SIZE_BYTES + 1 -> invalid', () => {
    // Arrange
    const file = { name: 'over.pdf', size: MAX_FILE_SIZE_BYTES + 1 };

    // Act
    const result = validateUploadFile(file);

    // Assert
    assert.strictEqual(result.isValid, false);
    assert.ok(result.error.includes('10MB'));
});

// Partition 6: every allowed extension in the whitelist should be accepted
test('validateUploadFile - EP6: every allowed extension (.png, .jpg, .jpeg) -> valid', () => {
    const allowed = ['photo.png', 'photo.jpg', 'photo.jpeg'];

    for (const name of allowed) {
        // Arrange
        const file = { name, size: 1024 };

        // Act
        const result = validateUploadFile(file);

        // Assert
        assert.strictEqual(result.isValid, true, `${name} should be valid`);
    }
});
