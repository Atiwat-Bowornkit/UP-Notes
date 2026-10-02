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

Workflow: `.github/workflows/ci.yml` — รันทุก PR เข้า `main` และทุก push เข้า `main` (2 jobs รันขนานกัน)

- **`lint`** (ESLint 9) — `npx --yes eslint@9 src tests` ตาม `eslint.config.js` — แดงเมื่อเจอตัวแปร/import
  ที่ไม่ได้ใช้ (`no-unused-vars`), ตัวแปรที่ไม่ได้ประกาศ (`no-undef`), การเทียบด้วย `==` (`eqeqeq`) ฯลฯ
  ไม่ใช้ `next lint` เพราะยัง error `Couldn't find any 'pages' or 'app' directory` (โปรเจกต์ยังไม่มีโฟลเดอร์หน้าเว็บ)
- **`test`** — `npm ci` → `npm run test:coverage` (Node.js 20, ubuntu-latest) — แดงเมื่อเทสต์ตัวใดตัวหนึ่ง fail
- **Branch Protection**: ⏳ **รอดำเนินการ** — ต้องตั้งใน Settings → Branches โดยเจ้าของ repo (ดูขั้น 5.7–5.8
  ของ `Lab12.md`) ให้ require status checks `lint` + `test` + require PR review ก่อน merge เข้า `main`
- **หลักฐาน "Merging is blocked"**: ⏳ **รอดำเนินการ** — จะแนบภาพหน้าจอหลังพิสูจน์ (แกล้งทำเทสต์พังชั่วคราว →
  push → แคปหน้า PR ตอนปุ่ม merge เป็นสีเทา → แก้กลับ)

## 5. บทเรียนที่ได้ (Reflection จากสมาชิกในทีม)

- **อธิวัฒน์ บวรกิจ (เน้น CI/CD และ Mutation Testing):** 
  "ตอนแรกที่เห็น Line Coverage 100% ก็คิดว่าโค้ดเซฟแล้ว แต่พอรัน Mutation Testing แล้วเจอ Mutant รอดไปถึง 19 ตัว ทำให้ผมรู้ซึ้งเลยว่า 'เทสต์เขียวหลอก' มีอยู่จริง การเปิดใช้ CI ควบคู่กับ Branch Protection จึงเป็นตาข่ายนิรภัยที่ขาดไม่ได้เลย เพื่อกันไม่ให้เพื่อน (หรือแม้แต่ตัวผมเอง) เผลอ push โค้ดพังๆ เข้า `main` ครับ"

- **สมาชิกคนที่ 2 ถิรวัฒน์ วงค์ทอง (เน้น Unit Test ขอบเขตข้อมูล):** 
  "ตอนเขียนเทสต์ฟังก์ชัน `validateUploadFile` ผมเกือบตกม้าตายตรงขอบเขต 10MB พอดีเป๊ะ การใช้เครื่องหมาย `>` กับ `>=` สลับกันแค่ตัวเดียวก็ทำให้ลอจิกพังได้ การเขียนเทสต์แบบ Boundary (บวก/ลบ 1 byte) ช่วยบีบให้ผมต้องคิดถึง Edge cases อย่างละเอียดและเขียนโค้ดได้รัดกุมขึ้นมาก"

- **สมาชิกคนที่ 3 นนทกร สิงห์ทอน (เน้น Property-based Testing & Search):** 
  "การใช้ `fast-check` สุ่มเทสต์เคสแปลกๆ มายิงใส่ `filterNotesBySearch` เป็นพันๆ รอบ เปิดโลกผมมากครับ มันช่วยหาบั๊กเรื่องตัวพิมพ์เล็ก/ใหญ่และการจัดการ input ผิดประเภทที่เราคาดไม่ถึง ทำให้ผมมั่นใจในความเสถียรของโค้ดมากกว่าการที่เรานั่งมโนค่ามาเทสต์เองแบบเดิมๆ"

- **สมาชิกคนที่ 4 ธนวรรณ สมแก้ว (เน้น TDD & Edge Cases ใน Pure Function):**
  "การฝึกเขียนโค้ดแบบ TDD ในโจทย์ fizzbuzz ทำให้ดิฉันเห็นความสำคัญของการดักเคสที่คนมักจะลืม เช่น เลขติดลบ ทศนิยม หรือค่าที่ไม่ใช่ตัวเลข ยิ่งฟังก์ชันที่เราเลือกเทสต์เป็น Pure Function ที่ไม่ต้องต่อ Database (เช่น การคำนวณคะแนนโน้ต) เรายิ่งเขียนเทสต์ครอบคลุม Logic พวกนี้ได้เร็วและมั่นใจขึ้นมากๆ ค่ะ"

> 📝 **หมายเหตุ:** ในหัวข้อนี้ สมาชิกแต่ละคนในทีมได้ร่วมกันสรุปบทเรียนจากสิ่งที่ต้องเจอกับตัวเองจริงๆ ระหว่างการทำสปรินต์ ทั้งเรื่องบั๊กที่เกือบพลาดและการใช้เครื่องมือทดสอบต่างๆ (เป็นไปตามแนวทาง AI_USAGE.md ที่ทีมต้องตกผลึกความรู้ด้วยตัวเอง)