# Safety Net ของทีม sec1-team-06 (UP-Notes)

> Lab 12B — Safety Net Sprint (รวม Lab 9 Testing + Lab 10 CI/CD)
> ตัวเลขในเอกสารนี้มาจากการรันจริงบนเครื่อง (`npm test`, `npm run test:coverage`) และจาก mutation
> testing ที่ทำไว้ตั้งแต่สปรินต์ Lab 9 — ไม่ได้กรอกมั่ว

## 1. ฟังก์ชันที่เลือกทดสอบ

- **`validateUploadFile(file)`** — `src/utils/notesHelper.js` — ตัดสินใจ accept/reject ไฟล์อัปโหลด
  (นามสกุล, ขนาด ≤ 10MB) — ผลกระทบต่อผู้ใช้จริงและมีเงื่อนไข `if` หลายกิ่ง
- **`filterNotesBySearch(notes, query, category)`** — `src/utils/notesHelper.js` — ตัดสินว่าโน้ตไหน
  แสดงผลในการค้นหา (ตรง category / ตรง query แบบ case-insensitive)
- **`calculatePopularityScore(likes, downloads)`** — `src/utils/notesHelper.js` — คำนวณคะแนนใช้จัดอันดับ
  โน้ตยอดนิยม
- **`fizzbuzz(n)`** — `src/fizzbuzz.js` — kata ที่ใช้ฝึก TDD Red-Green-Refactor (Lab 9 §B2) ครอบไว้ด้วยเทสต์
  ชุดใหญ่ที่สุดของโปรเจกต์ (edge case ตัวเลขติดลบ/ทศนิยม/ไม่ใช่ตัวเลข)

**เหตุผลที่เลือก**: ทั้งหมดเป็น **pure function** ไม่พึ่ง DB/API/เวลาปัจจุบัน เขียนเทสต์ได้เร็วและเสถียร
และเป็น business logic จริงของ UP-Notes (ตัดสินใจว่าไฟล์ไหนอัปโหลดได้ / โน้ตไหนถูกค้นเจอ / โน้ตไหนติดอันดับยอดนิยม)

## 2. เทสต์ที่เขียน (78 ตัว รวม — เกินเกณฑ์ขั้นต่ำ 5 ตัว)

เทสต์ทั้งหมดมาจากสปรินต์ Lab 9 (`feature/lab9-testing`, PR [#56](../../pull/56) และ [#58](../../pull/58))
ใช้ Node.js native test runner (`node:test`) + property-based testing (`fast-check`)

| ไฟล์ | จำนวน | ชนิดหลัก |
| --- | --- | --- |
| `tests/notes.test.js` | 5 | happy (smoke test เดิมจาก Lab 7) |
| `tests/test_unit.test.js` | 12 | happy + edge + error (Equivalence Partitioning + Boundary) |
| `tests/test_fizzbuzz.test.js` | 37 | happy + edge + error (TDD kata + type-guard) |
| `tests/test_property.test.js` | 11 | property-based (invariants) |
| `tests/test_mutation_regression.test.js` | 13 | regression (ปิดช่องที่ mutation testing เจอ) |
| **รวม** | **78** | |

**ตัวอย่างที่ครบ 3 ประเภทตามเกณฑ์ (2 happy · 2 edge · 1 error) ของ `validateUploadFile`**

| # | ชื่อเทสต์ | ประเภท | ยืนยันอะไร |
| --- | --- | --- | --- |
| 1 | `validateUploadFile - valid PDF within size limit passes` | happy | ไฟล์ถูกต้องต้องผ่าน |
| 2 | `validateUploadFile - accepts all explicitly allowed extensions` | happy | ทุกนามสกุลที่อนุญาตต้องผ่าน |
| 3 | `validateUploadFile - upper boundary: exactly MAX_FILE_SIZE_BYTES passes` | edge | พอดี 10MB ต้องผ่าน (ไม่ใช่ `>=`) |
| 4 | `validateUploadFile - upper boundary + 1: MAX_FILE_SIZE_BYTES + 1 fails` | edge | เกิน 10MB แม้แค่ 1 byte ต้องถูกปฏิเสธ |
| 5 | `validateUploadFile - disallowed extension (.exe) returns invalid` | error | นามสกุลอันตรายต้องถูกบล็อกพร้อมข้อความ error |

**ตัวอย่างเพิ่มเติมจาก `filterNotesBySearch` และ `calculatePopularityScore`**

| # | ชื่อเทสต์ | ประเภท | ยืนยันอะไร |
| --- | --- | --- | --- |
| 6 | `filterNotesBySearch - case-insensitive match on title` | happy | ค้นหาไม่สนตัวพิมพ์เล็ก/ใหญ่ |
| 7 | `filterNotesBySearch - returns empty array for invalid input type` | error | input ผิดชนิดต้องไม่ crash คืน `[]` |
| 8 | `property: calculatePopularityScore is monotonic in likes` | edge (property) | เพิ่ม likes แล้วคะแนนต้องไม่มีวันลดลง (สุ่ม input หลายพันเคส) |
| 9 | `property: filterNotesBySearch results must always be a subset of the original notes` | edge (property) | ผลกรองต้องเป็นสับเซ็ตของ input เสมอ ไม่มีวันเพิ่มรายการเอง |

## 3. Coverage (ผลรันจริงจากเครื่อง — `npm run test:coverage`)

```text
# tests 78
# pass 78
# fail 0
# -----------------------------------------------------------------------------------
# file                               | line % | branch % | funcs % | uncovered lines
# -----------------------------------------------------------------------------------
# src
#  fizzbuzz.js                       | 100.00 |   100.00 |  100.00 |
#  utils
#   notesHelper.js                   | 100.00 |   100.00 |  100.00 |
# -----------------------------------------------------------------------------------
# all files                          | 100.00 |   100.00 |  100.00 |
# -----------------------------------------------------------------------------------
```

- **ตีความ**: ครอบคลุมทุกบรรทัดและทุกกิ่งเงื่อนไขของ `src/fizzbuzz.js` และ `src/utils/notesHelper.js`
- **มากกว่าแค่ line coverage**: ทีมยังรัน **mutation testing** ด้วย Stryker Mutator (JS-equivalent ของ `mutmut`
  ที่ Lab 9 แนะนำ — ดู `mutmut-results.txt`) รอบแรกพบ 19 mutants ที่ "survived" ใน `filterNotesBySearch`
  (การเทียบ category, การ trim query, การจับคู่ตัวพิมพ์เล็ก-ใหญ่) หลังเพิ่ม `test_mutation_regression.test.js`
  เพื่อปิดช่องเหล่านั้น mutation score เพิ่มขึ้นอย่างมีนัยสำคัญ — พิสูจน์ว่า 100% line coverage ของทีมนี้ไม่ใช่
  "เขียวหลอก" เพราะเทสต์จับได้จริงเวลาโค้ดถูกเปลี่ยนพฤติกรรม
- **ส่วนที่ยังไม่ครอบคลุมนอก `src/`**: โค้ด UI/route ของ Next.js (`app/`, `pages/`) ยังไม่มีในโปรเจกต์ตอนนี้
  (อยู่ระหว่างขั้น scaffold) — ยังไม่มี integration test ระดับหน้าเว็บ ยอมรับความเสี่ยงได้เพราะยังไม่มีโค้ด UI จริง
  ที่ต้องป้องกัน จะเพิ่มเทสต์ชั้นนี้เมื่อเริ่มสร้างหน้าเว็บจริง

## 4. CI block อะไรบ้าง

- **`test`** (`.github/workflows/test.yml`) — `npm ci` → `npm run test:coverage` (Node.js 20, ubuntu-latest)
  รันทุก PR เข้า `main` และทุก push เข้า `main` — เขียวจริงบน PR [#56](../../pull/56)/[#58](../../pull/58) แล้ว
- **`lint`** — **ยังไม่เพิ่มเป็น CI job แยกในรอบนี้โดยตั้งใจ**: `npm run lint` (`next lint`) ยัง error ทันที
  ด้วย `Couldn't find any 'pages' or 'app' directory` เพราะโปรเจกต์ยังไม่มีโฟลเดอร์หน้าเว็บจริง (อยู่ขั้น
  scaffold/architecture) — ถ้าใส่ job นี้ตอนนี้จะกลายเป็น CI แดงค้างที่ไม่เกี่ยวกับคุณภาพโค้ดจริง จะเพิ่ม job
  `lint` เมื่อเริ่มมีโฟลเดอร์ `app/` จริงในสปรินต์ถัดไป
- **Branch Protection**: ⏳ **รอดำเนินการ** — ต้องตั้งใน Settings → Branches โดยเจ้าของ repo (ดูขั้น 5.7–5.8
  ของ `Lab12.md`) ให้ require status check `test` + require PR review ก่อน merge เข้า `main`
- **หลักฐาน "Merging is blocked"**: ⏳ **รอดำเนินการ** — จะแนบภาพหน้าจอหลังพิสูจน์ (แกล้งทำเทสต์พังชั่วคราว →
  push → แคปหน้า PR ตอนปุ่ม merge เป็นสีเทา → แก้กลับ)

## 5. บทเรียนที่ได้

- **Boundary ที่เกือบพลาด**: `validateUploadFile` ต้องแยก "พอดี 10MB" (ผ่าน) ออกจาก "เกิน 10MB แม้ 1 byte"
  (ไม่ผ่าน) อย่างเป๊ะ — ถ้าเขียน `size >= MAX_FILE_SIZE_BYTES` แทน `size > MAX_FILE_SIZE_BYTES` จะพลาดทันที
  ชนิด bug เดียวกับที่ Knight Capital พลาด (Lab12.md §1)
- **Line coverage 100% ไม่พอ**: รอบแรกที่ทำ mutation testing เจอ 19 mutants รอดใน `filterNotesBySearch`
  ทั้งที่ coverage ตัวเลขบอกว่าครบแล้ว — สอนให้รู้ว่า "เขียว" ต้องเปิดดูว่าเทสต์ยืนยัน behavior จริงหรือแค่ผ่าน
  เฉยๆ (เหมือนบทเรียน "เขียวหลอก" ในข้อ 4.10 ของ Lab12.md)
- **CI/Branch Protection ทำให้ตาข่ายทำงานเองทุกครั้งที่ push** — แต่ต้องเปิด Branch Protection จริงถึงจะบังคับ
  ได้ (มีแค่ CI เขียวเฉยๆ ยังกด merge ทับได้เสมอ) — นี่คือเหตุผลที่เอกสารข้อ 4 ยังทำเครื่องหมาย ⏳ ไว้จนกว่าจะตั้งค่าเสร็จ

> 📝 **หมายเหตุ**: ร่างเอกสารนี้ทำโดย Claude Code จากข้อมูลจริงของโปรเจกต์ (ผลรันเทสต์/coverage/mutation ที่มีอยู่แล้ว)
> ทีมได้อ่านทบทวนและแก้ไขเนื้อหาส่วน "บทเรียนที่ได้" ให้เป็นมุมมองของทีมเองก่อน merge ตามนโยบาย AI ของวิชา — ดู `AI_USAGE.md`
