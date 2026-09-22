/**
 * Lab 9 — Step 3: Property-Based Test
 * Target function: calculatePopularityScore (src/utils/notesHelper.js)
 * Tool: fast-check (Node.js equivalent of Hypothesis)
 */

const test = require('node:test');
const assert = require('node:assert');
const fc = require('fast-check');
const { calculatePopularityScore } = require('../src/utils/notesHelper');

// Property 1: the score is never negative for non-negative inputs.
test('property: calculatePopularityScore is always non-negative for non-negative inputs', () => {
    fc.assert(
        fc.property(fc.nat(), fc.nat(), (likes, downloads) => {
            const score = calculatePopularityScore(likes, downloads);
            return score >= 0;
        })
    );
});

// Property 2: monotonic — adding one more like never decreases the score.
test('property: calculatePopularityScore is monotonic in likes', () => {
    fc.assert(
        fc.property(fc.nat(), fc.nat(), (likes, downloads) => {
            const before = calculatePopularityScore(likes, downloads);
            const after = calculatePopularityScore(likes + 1, downloads);
            return after > before;
        })
    );
});

// Property 3: monotonic — adding one more download never decreases the score.
test('property: calculatePopularityScore is monotonic in downloads', () => {
    fc.assert(
        fc.property(fc.nat(), fc.nat(), (likes, downloads) => {
            const before = calculatePopularityScore(likes, downloads);
            const after = calculatePopularityScore(likes, downloads + 1);
            return after > before;
        })
    );
});

// Property 4: a like is always worth exactly twice a download (the business rule
// this function exists to encode), independent of the actual magnitude chosen.
test('property: one like is worth exactly two downloads', () => {
    fc.assert(
        fc.property(fc.nat(), fc.nat(), (likes, downloads) => {
            const scoreWithExtraLike = calculatePopularityScore(likes + 1, downloads);
            const scoreWithTwoExtraDownloads = calculatePopularityScore(likes, downloads + 2);
            return scoreWithExtraLike === scoreWithTwoExtraDownloads;
        })
    );
});
// ดึงฟังก์ชันที่ต้องการทดสอบเข้ามา (สมมติว่ามีอยู่ใน notesHelper)
const { filterNotesBySearch } = require('../src/utils/notesHelper');

// Property 5: filterNotesBySearch returns a subset of the input array.
test('property: filterNotesBySearch results must always be a subset of the original notes', () => {
    // กำหนดรูปแบบข้อมูลจำลอง (Arbitrary) สำหรับ Note 
    // โดยสมมติว่า Note มี id, title, และ content เป็น string
    const noteArbitrary = fc.record({
        id: fc.string(),
        title: fc.string(),
        content: fc.string(),
        category: fc.string()
    });

    fc.assert(
        // สุ่ม Array ของ Note และ สุ่ม String สำหรับ Query
        fc.property(fc.array(noteArbitrary), fc.string(), (notes, query) => {
            
            // Act
            const result = filterNotesBySearch(notes, query);
            
            // Assert: Invariant 1 - ขนาดของผลลัพธ์ต้องไม่เกินต้นฉบับ
            const isLengthValid = result.length <= notes.length;
            
            // Assert: Invariant 2 - ทุกตัวในผลลัพธ์ ต้องเป็นตัวที่มีอยู่ใน array ต้นฉบับ
            // (ใช้ object reference เช็คได้เลย เพราะฟังก์ชัน filter ปกติจะไม่ clone object ใหม่)
            const isSubset = result.every(filteredNote => notes.includes(filteredNote));
            
            return isLengthValid && isSubset;
        })
    );
});

// Property 6 : ถ้า query เป็นค่าว่าง (Empty String) ผลลัพธ์จะต้องได้ array ที่มีขนาดเท่าเดิม
test('property: filterNotesBySearch with empty query returns all original notes', () => {
    const noteArbitrary = fc.record({
        id: fc.string(),
        title: fc.string()
    });

    fc.assert(
        fc.property(fc.array(noteArbitrary), (notes) => {
            // Act: ใช้ empty string เป็น query
            const result = filterNotesBySearch(notes, "");
            
            // Assert: ความยาวต้องเท่าเดิม
            return result.length === notes.length;
        })
    );
});

// ==========================================
// Properties สำหรับ calculatePopularityScore
// ==========================================

// Property 7: Additivity (คุณสมบัติการบวก)
// การแยกคำนวณทีละก้อน แล้วเอาคะแนนมารวมกัน จะต้องเท่ากับการเอาจำนวนมารวมกันก่อนแล้วค่อยคำนวณ
test('property: calculatePopularityScore is additive (linear)', () => {
    fc.assert(
        fc.property(fc.nat(), fc.nat(), fc.nat(), fc.nat(), (l1, d1, l2, d2) => {
            const combinedScore = calculatePopularityScore(l1 + l2, d1 + d2);
            const separateScore = calculatePopularityScore(l1, d1) + calculatePopularityScore(l2, d2);
            return combinedScore === separateScore;
        })
    );
});

// Property 8: Scaling / Multiplicative (คุณสมบัติการคูณ/ขยายสัดส่วน)
// ถ้าเราคูณยอด Like และ Download ด้วย N คะแนนรวมก็ต้องเพิ่มขึ้นเป็น N เท่าด้วยเช่นกัน
test('property: calculatePopularityScore scales linearly', () => {
    fc.assert(
        // ป้องกันค่า multiplier ใหญ่เกินไปจน integer overflow เลยจำกัดไว้ที่ไม่เกิน 100
        fc.property(fc.nat(), fc.nat(), fc.nat(100), (likes, downloads, multiplier) => {
            const scoreWithScaledInputs = calculatePopularityScore(likes * multiplier, downloads * multiplier);
            const scaledScore = calculatePopularityScore(likes, downloads) * multiplier;
            return scoreWithScaledInputs === scaledScore;
        })
    );
});

// Property 9: Zero Identity (ค่าเริ่มต้น)
test('property: score is exactly 0 when both likes and downloads are 0', () => {
    assert.strictEqual(calculatePopularityScore(0, 0), 0);
});


// ==========================================
// Properties สำหรับ filterNotesBySearch
// ==========================================

const noteBaseArbitrary = fc.record({
    id: fc.string(),
    title: fc.string(),
    content: fc.string(),
    category: fc.string()
});

// Property 10: Idempotence (ทำซ้ำกี่รอบผลลัพธ์ก็ต้องเหมือนเดิม)
// ถ้าเราเอาผลลัพธ์ที่ผ่านการ Filter แล้ว ไปทำการ Filter ซ้ำด้วย Query เดิม จำนวนข้อมูลต้องเท่าเดิมเป๊ะ
test('property: filterNotesBySearch is idempotent', () => {
    fc.assert(
        fc.property(fc.array(noteBaseArbitrary), fc.string(), (notes, query) => {
            const firstPass = filterNotesBySearch(notes, query);
            const secondPass = filterNotesBySearch(firstPass, query);
            
            return firstPass.length === secondPass.length;
        })
    );
});

// Property 11: Case-insensitivity (ไม่สนใจตัวพิมพ์เล็ก/ใหญ่)
// ไม่ว่าผู้ใช้จะพิมพ์ Query เป็นพิมพ์เล็กล้วน หรือพิมพ์ใหญ่ล้วน ผลลัพธ์ที่ Match เจอจะต้องเท่ากันเสมอ
test('property: filterNotesBySearch results are independent of query casing', () => {
    fc.assert(
        fc.property(fc.array(noteBaseArbitrary), fc.string(), (notes, query) => {
            const lowerCaseResult = filterNotesBySearch(notes, query.toLowerCase());
            const upperCaseResult = filterNotesBySearch(notes, query.toUpperCase());
            
            return lowerCaseResult.length === upperCaseResult.length;
        })
    );
});