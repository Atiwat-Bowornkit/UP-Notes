# 💭 Reflection Document (Post-quiz 9 Exit Ticket) — Lab 9

เอกสารการสะท้อนคิด (Reflection & Exit Ticket) สำหรับ **Lab 9: Unit Test + TDD + Property-Based Test + GitHub Actions CI**

> ⚠️ **ยังเป็น placeholder** — เนื้อหาด้านล่างเป็นโครงร่างที่ AI ร่างไว้ตามหัวข้อ Post-quiz 9 (B1/B2/B3) ในเอกสาร Lab9.md §5 **ทีมต้องแทนที่ด้วยคำตอบจริงของตนเอง** (คิดมาก่อนเข้าคาบ/ระหว่างคาบบรรยาย) ก่อน merge เข้า `main`

---

## 1. Unit Test Plan (B1) — ใช้เป็น starter สำหรับ Exercise 9.1

* **function ที่เลือก:** `validateUploadFile` (`src/utils/notesHelper.js`)
* **เหตุผลที่เลือก:** _[ทีมกรอก]_ เพราะอะไรฟังก์ชันนี้ "ทดสอบง่าย" และเป็น core business logic ของโปรเจกต์?
* **Equivalence Partitions ที่ระบุ:** _[ทีมกรอก]_ — เช่น ไฟล์ไม่มี / นามสกุลผิด / ขนาดเกินลิมิต / ขนาดพอดี / นามสกุลตัวพิมพ์ใหญ่ ฯลฯ
* **Test ปัจจุบันของทีม test "behavior" หรือแค่ "exercise code"?** _[ทีมกรอกคำตอบและเหตุผล]_

---

## 2. TDD Plan (B2) — ใช้กับ Exercise 9.2 (FizzBuzz Kata)

* **ความเข้าใจเรื่อง Red-Green-Refactor:** _[ทีมกรอก]_ — ทำไมต้องเขียน test ก่อนเขียน production code?
* **สิ่งที่คาดว่าจะยากที่สุดใน TDD คือ:** _[ทีมกรอก]_
* **จะรู้ได้อย่างไรว่ากำลังเขียน test "ให้ coverage ขึ้น" ไม่ใช่ "test first user" (TDD zealot trap):** _[ทีมกรอก]_

---

## 3. Property-Based Test Plan (B3) — ใช้กับ Exercise 9.3

* **function ที่เลือก:** `calculatePopularityScore` (`src/utils/notesHelper.js`)
* **Property (invariant) ที่คาดว่า valid สำหรับทุก input:** _[ทีมกรอก]_ — เช่น ความสัมพันธ์ระหว่าง likes/downloads กับ score
* **ความแตกต่างระหว่าง "property" กับแค่ "type check" (เช่น `assert isinstance(result, int)`):** _[ทีมกรอกความเข้าใจของทีม]_

---

*หมายเหตุ: reflect.md นี้ต้อง merge เข้ามาพร้อมกับ PR `feature/lab9-testing` ตามข้อกำหนด §4.2 ของ Lab9.md*
