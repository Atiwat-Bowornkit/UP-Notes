# 💭 Reflection Document (Post-quiz 9 Exit Ticket) — Lab 9

เอกสารการสะท้อนคิด (Reflection & Exit Ticket) สำหรับ **Lab 9: Unit Test + TDD + Property-Based Test + GitHub Actions CI**

---

## 1. Unit Test Plan (B1) — ใช้เป็น starter สำหรับ Exercise 9.1

* **function ที่เลือก:** `validateUploadFile` (`src/utils/notesHelper.js`)
* **เหตุผลที่เลือก:** เป็น pure function — รับ `file` object แล้วคืนค่า `{ isValid, error }` โดยไม่แตะ DOM, network หรือ global state ทำให้ทดสอบได้ง่ายโดยไม่ต้อง mock อะไรเลย และเป็น core business logic จริงของฟีเจอร์ "อัปโหลดโน้ต" — ถ้าฟังก์ชันนี้ผิด ผู้ใช้จะอัปโหลดไฟล์อันตราย/ไฟล์ใหญ่เกินได้ หรือไฟล์ที่ถูกต้องกลับถูกปฏิเสธ ซึ่งกระทบ business โดยตรง
* **Equivalence Partitions ที่ระบุ:** (1) ไม่มีไฟล์/ไม่มีชื่อไฟล์ (invalid), (2) นามสกุลอยู่ใน allow-list + ขนาดปกติ (valid), (3) นามสกุลนอก allow-list เช่น `.exe` (invalid), (4) ขนาดไฟล์เกิน `MAX_FILE_SIZE_BYTES` (invalid), (5) นามสกุลตัวพิมพ์ใหญ่ เช่น `.PDF` (valid — ตรวจว่า case-insensitive), (6) นามสกุลที่ได้รับอนุญาตทุกตัว `.pdf/.png/.jpg/.jpeg` (valid ทั้งหมด) — **boundary values** ที่เพิ่มจากพาร์ทิชันข้อ 4: ขนาด 0 byte (ต้องผ่าน), ขนาดเท่ากับ `MAX_FILE_SIZE_BYTES` พอดี (ต้องผ่าน เพราะเงื่อนไขเป็น `>` ไม่ใช่ `>=`), และขนาดเกิน `MAX_FILE_SIZE_BYTES` ไป 1 byte (ต้องไม่ผ่าน)
* **Test ปัจจุบันของทีม test "behavior" หรือแค่ "exercise code"?** Test "behavior" จริง — ทุก assertion ตรวจผลลัพธ์ทางธุรกิจ (`isValid` เป็น true/false และเนื้อหา `error` message ที่ผู้ใช้จะเห็น) ไม่ใช่แค่เรียกฟังก์ชันแล้วเช็คว่าไม่ throw exception หลักฐานคือ Saboteur test (`docs/saboteur-journal.md`) ที่แก้ `>` เป็น `>=` แล้ว test boundary จับได้ทันที ถ้า test แค่ exercise code (เช่น `assert(typeof result === 'object')`) การ sabotage แบบนี้จะไม่มีทาง fail เลย

---

## 2. TDD Plan (B2) — ใช้กับ Exercise 9.2 (FizzBuzz Kata)

* **ความเข้าใจเรื่อง Red-Green-Refactor:** เขียน test ก่อน production code เพราะ test คือ "ผู้ใช้คนแรก" ของ interface (PP Tip 67) — บังคับให้คิดถึงรูปแบบ input/output ที่ต้องการ *ก่อน* ตัดสินใจว่าจะ implement อย่างไร ลำดับที่ทีมทำจริงคือ: RED (`fizzbuzz(3)` ยังไม่มี implementation → fail) → GREEN (คืนค่า `"Fizz"` แบบ hard-code ที่สุดเท่าที่พอผ่านได้) → เพิ่ม test case ใหม่ทีละตัว (1, 5, 15, 7) แต่ละตัวบังคับให้ production code ทั่วไปขึ้นทีละขั้น จนครบทุก case แล้วจึง REFACTOR แยก `is_multiple(n, factor)` ออกมาเป็น helper โดยที่ tests ทั้งหมดยังผ่านตลอด (ดู commit history: `d212b44` → `36e6c0f`)
* **สิ่งที่คาดว่าจะยากที่สุดใน TDD คือ:** การ "เขียนโค้ดน้อยที่สุดเท่าที่จะพอผ่าน test" ในขั้น GREEN — สัญชาตญาณธรรมชาติคืออยากเขียน general solution ให้ครบทีเดียว (เช่น เขียนเงื่อนไข `%15/%3/%5` ทั้งหมดตั้งแต่ test แรก) แต่นั่นขัดกับวินัยของ TDD ที่ต้องการให้ *test เป็นตัวขับเคลื่อน* การขยาย logic ทีละสเต็ป ไม่ใช่ให้ผู้เขียนคาดเดาล่วงหน้า
* **จะรู้ได้อย่างไรว่ากำลังเขียน test "ให้ coverage ขึ้น" ไม่ใช่ "test first user" (TDD zealot trap):** เช็คว่า test แต่ละตัวมี business meaning ที่อธิบายได้ด้วยประโยคภาษาคน (เช่น "เลขที่หาร 15 ลงตัวต้องได้ FizzBuzz") ไม่ใช่เขียนเพื่อให้ชนกับบรรทัดที่ยังไม่ถูก cover — ถ้าลบ test ออกแล้ว "ไม่มีใครรู้สึกว่าขาดอะไรไป" (ไม่มี requirement ไหนที่ไม่ถูกพูดถึง) แปลว่ากำลังไล่ coverage เฉย ๆ ไม่ใช่ไล่ behavior

---

## 3. Property-Based Test Plan (B3) — ใช้กับ Exercise 9.3

* **function ที่เลือก:** `calculatePopularityScore` (`src/utils/notesHelper.js`)
* **Property (invariant) ที่คาดว่า valid สำหรับทุก input:** (1) **Non-negativity** — สำหรับ `likes, downloads ≥ 0` ทุกค่า ผลลัพธ์ต้อง `≥ 0` เสมอ, (2) **Monotonicity** — เพิ่ม `likes` หรือ `downloads` อีก 1 หน่วย คะแนนต้องเพิ่มขึ้นเสมอ (ไม่มีทางลดลงหรือเท่าเดิม), (3) **Business-rule invariant** — กติกาจริงของระบบคือ "1 like มีค่าเท่ากับ 2 downloads" ดังนั้น `score(likes+1, downloads)` ต้องเท่ากับ `score(likes, downloads+2)` เสมอ ไม่ว่าเลข `likes/downloads` เริ่มต้นจะเป็นเท่าไหร่ — Hypothesis/`fast-check` จะสุ่มค่า `likes, downloads` หลายพันชุดเพื่อยืนยันว่า invariant นี้เป็นจริงในทุกกรณี ไม่ใช่แค่ตัวอย่างที่ทีมคิดขึ้นเอง
* **ความแตกต่างระหว่าง "property" กับแค่ "type check" (เช่น `assert isinstance(result, int)`):** type check ตรวจแค่ "รูปร่าง" ของผลลัพธ์ (เป็นตัวเลขจริงไหม) แต่ไม่บอกอะไรเลยว่าค่านั้น "ถูกต้องตาม business logic" หรือไม่ — ฟังก์ชันที่ return `0` เสมอ ก็ผ่าน type check ได้ทั้งที่ผิดสิ้นเชิง ส่วน property ต้องระบุ **ความสัมพันธ์ (relationship/invariant)** ระหว่าง input กับ output ที่ยังคงเป็นจริงเสมอไม่ว่า input จะเป็นอะไร เช่น "เพิ่ม like แล้วคะแนนต้องสูงขึ้น" — นี่คือสิ่งที่ทำให้ property-based test สามารถจับ bug ที่ example-based test คิดไม่ถึง เพราะมันทดสอบ "กฎ" ไม่ใช่ "ตัวอย่างเดียว"

---

*reflect.md นี้ merge เข้ามาพร้อมกับ PR `feature/lab9-testing` ตามข้อกำหนด §4.2 ของ Lab9.md*

---
---

# 💭 Reflection Document (Post-quiz 12 Exit Ticket) — Lab 12B Safety Net Sprint

## 1. Safety Net ของทีม (§12.4)

* **คำถาม:** จากการสร้างชุดทดสอบตั้งแต่ Lab 9 จนถึง Lab 12B นิสิตคิดว่า Safety Net ของทีมมีความแข็งแกร่งระดับไหน ช่วยลดความกังวลตอนเขียนโค้ดได้จริงหรือไม่ และมีจุดอ่อนอะไรที่ต้องระวัง?
* **คำตอบของทีม:** Safety Net ของทีมในส่วนของ Business logic ถือว่าแข็งแกร่งและเชื่อถือได้มากครับ เพราะเราไม่ได้มีแค่ Unit Test ธรรมดา แต่มีทั้ง Property-based test และจับโกงด้วย Mutation Testing ทำให้มั่นใจว่าไม่มีเคส "เขียวหลอก" แน่นอน เวลาแก้ logic พวก `notesHelper.js` จึงกล้าแก้โดยไม่กลัวพัง แต่จุดอ่อนตอนนี้คือเรายังไม่มีเทสต์ในระดับ UI หรือ Integration Test สำหรับ Next.js ถ้ามีการเชื่อมต่อ API หรือแก้ Component หน้าเว็บ ก็อาจจะยังมีบั๊กที่กระทบผู้ใช้หลุดรอดไปได้อยู่ครับ

## 2. CI + Branch Protection

* **คำถาม:** จงอธิบายว่าทำไมการมีระบบ CI (GitHub Actions) ที่ตั้งค่าไว้อย่างสมบูรณ์ ถึงยังไม่สามารถปกป้อง `main` branch จากโค้ดที่พังได้ หากไม่มีการเปิดใช้งาน Branch Protection ร่วมด้วย?
* **คำตอบของทีม:** เพราะ CI ทำหน้าที่แค่ "ผู้รายงาน" ครับ มันช่วยรันเทสต์และแจ้งเตือนเราว่าโค้ดที่เพิ่ง push มานั้นผ่าน (เขียว) หรือพัง (แดง) แต่ไม่มีสิทธิ์ห้ามใครรวมโค้ด ถ้าทีมไม่มี Branch Protection ใครก็สามารถเพิกเฉยต่อคำเตือนสีแดงแล้วฝืนกด Merge โค้ดพังๆ ทับลง `main` ได้เลย Branch Protection จึงเป็นเหมือน "ยาม" ที่รับคำสั่งจาก CI มาบล็อกปุ่ม Merge ไว้ โดยบังคับว่า CI ต้องเขียว 100% และต้องมีคนรีวิว (Approve) ก่อนเท่านั้น โค้ดถึงจะเข้า `main` ได้ครับ

## 3. สิ่งที่จะทำต่อ (Characterization Test → Refactor ใน W13)

* **คำถาม:** ในสัปดาห์หน้า (W13) ทีมมีแผนจะต้อง Refactor โค้ดเก่า ทำไมแนวทางปฏิบัติที่ดีจึงแนะนำให้เขียน Characterization Test คลุมโค้ดชุดนั้นก่อนที่จะเริ่มปรับแก้โครงสร้าง?
* **คำตอบของทีม:** เพราะโค้ดเก่า (Legacy code) มักจะไม่มีเทสต์และเราอาจจะไม่รู้พฤติกรรมการทำงานลึกๆ ของมันทั้งหมด การเขียน Characterization test คือการ "ล็อคพฤติกรรมปัจจุบัน" ของโค้ดนั้นไว้ (ไม่ว่าพฤติกรรมนั้นจะตั้งใจหรือไม่ตั้งใจก็ตาม) เปรียบเหมือนการถ่ายรูป Before ไว้ก่อนทำศัลยกรรม เพื่อให้ตอนที่เรา Refactor รื้อโครงสร้างโค้ด เราจะมี Safety net คอยฟ้องทันทีถ้าเราเผลอไปทำลายพฤติกรรมดั้งเดิมของระบบครับ

---

*ส่วน Post-quiz 12 นี้ merge เข้ามาพร้อมกับ PR `feature/safety-net` ตามข้อกำหนด §6.3 ของ Lab12.md*
