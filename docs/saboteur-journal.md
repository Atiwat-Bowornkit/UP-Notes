# 🕵️ Saboteur Testing Journal — UP-Notes (Lab 9)

บันทึกผล **Saboteur Testing** (การจงใจ break code เพื่อตรวจสอบว่า test suite จับ bug ได้จริง) ตาม Step 5 ของ Lab 9 — Unit Test + TDD + Property-Based Test + GitHub Actions CI

---

## 📌 1. Bug ที่จงใจสร้างขึ้น (Manual Sabotage)

* **ฟังก์ชันเป้าหมาย:** `validateUploadFile` (`src/utils/notesHelper.js`)
* **การเปลี่ยนแปลง:** เปลี่ยนเงื่อนไขตรวจสอบขนาดไฟล์จาก `>` เป็น `>=`

```diff
- if (file.size > MAX_FILE_SIZE_BYTES) {
+ if (file.size >= MAX_FILE_SIZE_BYTES) {
```

* **ผลกระทบที่คาดไว้:** ไฟล์ที่มีขนาด**เท่ากับ** `MAX_FILE_SIZE_BYTES` พอดี (10MB) จะถูกปฏิเสธทั้งที่ควรผ่าน (off-by-one ที่ boundary)

---

## 🧪 2. ผลการรัน Test Suite หลัง Sabotage

```
npm test

ℹ tests 23
ℹ pass 22
ℹ fail 1

✖ failing tests:
test at tests/test_unit.test.js:88:1
✖ validateUploadFile - Boundary: size == MAX_FILE_SIZE_BYTES exactly -> valid
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  false !== true
```

**ผลลัพธ์: ✅ Detected — 1/1 saboteur bugs พบและถูกจับได้**

Test ที่จับ bug ได้คือ `validateUploadFile - Boundary: size == MAX_FILE_SIZE_BYTES exactly -> valid` ใน `tests/test_unit.test.js` ซึ่งเป็น boundary value test ที่เขียนไว้ใน Step 1 (Equivalence Partitioning + Boundary Value Analysis) โดยเฉพาะเพื่อตรวจสอบ off-by-one ที่ขอบเขต `MAX_FILE_SIZE_BYTES`

Test อื่นอีก 22 เทส (unit tests ปกติ, FizzBuzz kata, property-based tests) ยังคง**ผ่านหมด** เพราะไม่ได้ทดสอบค่าที่ตำแหน่งขอบเขตพอดี — ยืนยันว่า test ที่จับ bug ได้คือ boundary test โดยเฉพาะ ไม่ใช่ test อื่นบังเอิญ fail

---

## 🔁 3. การ Revert

หลังยืนยันว่า test จับ bug ได้ ทีมได้ revert โค้ดกลับเป็น `if (file.size > MAX_FILE_SIZE_BYTES)` ตามเดิม และรัน `npm test` ซ้ำอีกครั้งเพื่อยืนยันว่ากลับมา **23/23 tests pass**

---

## 🎓 4. บทเรียนที่ได้รับ (Lessons Learned)

1. **Boundary tests คือด่านแรกที่จับ off-by-one ได้จริง** — ถ้า Step 1 ไม่ได้เขียน boundary test ไว้ที่ `size == MAX_FILE_SIZE_BYTES` โดยเฉพาะ การ sabotage ครั้งนี้จะ**ไม่มี test ใดจับได้เลย** แม้ coverage บรรทัดจะยังสูงเท่าเดิม — ตรงกับ [PP] Tip 93 (Test State Coverage, Not Code Coverage): coverage วัดว่าโค้ด "รัน" ไม่ใช่ "state ที่ถูกทดสอบ"
2. **State coverage > Code coverage:** บรรทัด `if (file.size > MAX_FILE_SIZE_BYTES)` ถูก "รัน" (exercised) โดย test เดิมอยู่แล้วทั้งก่อนและหลัง sabotage แต่มีเพียง test ที่ตั้งค่า `size` ให้ตรงกับ boundary พอดีเท่านั้นที่เปิดเผยความแตกต่างของ behavior ระหว่าง `>` กับ `>=`
3. **Saboteur Testing เป็นเครื่องมือตรวจสอบคุณภาพของ test เอง** — ถ้า Actions ไม่ fail หลัง sabotage แปลว่าต้อง**เพิ่ม test** ไม่ใช่ลบ property หรือลดมาตรฐานลง
