# 🤖 AI Usage Declaration (บันทึกการใช้งาน Generative AI)

โปรเจกต์นี้ปฏิบัติตามนโยบายการใช้งาน Generative AI (AI Usage Guidance) ของรายวิชาแนวคิดวิศวกรรมซอฟต์แวร์ (225311) อย่างเคร่งครัด

---

## 📋 สรุปการใช้งาน Generative AI ในโปรเจกต์

### Lab 1: First Pragmatic Commit
| สมาชิกทีม | เครื่องมือ AI ที่ใช้ | วัตถุประสงค์การใช้งาน | การเปิดเผยและตรวจสอบ |
| :--- | :--- | :--- | :--- |
| **นาย อธิวัฒน์ บวรกิจ** | Antigravity AI / ChatGPT | ช่วยปรับแก้ไวยากรณ์และความสละสลวยของภาษาไทย/อังกฤษ ในสไลด์และเอกสาร | ตรวจสอบเนื้อหา Pragmatic Promise และการสะท้อนคิดว่าเป็นประสบการณ์จริงของตนเอง |
| **นาย ถิรวัฒน์ วงค์ทอง** | Antigravity AI / Claude | ช่วย Brainstorm หัวข้อ Broken Window และตรวจสอบโครงสร้าง Commit Message | ตรวจสอบคำตอบและปรับแต่งด้วยคำพูดของตนเองทั้งหมด |
| **นาย นนทกร สิงห์ทอน** | Antigravity AI / GitHub Copilot | ช่วยอธิบายคำสั่ง Git CLI / Markdown Syntax และแนะนำสถาปัตยกรรม UI | ใช้ AI เป็นผู้ช่วยอธิบาย ไม่ได้ให้ AI เจนเนอเรตคำตอบส่วนบุคคลแทน |
| **นางสาว ธนวรรณ สมแก้ว** | Antigravity AI | ช่วยเรียบเรียงโครงสร้างเอกสารบทบาทหน้าที่และรูปแบบ PR Description | ตรวจสอบความถูกต้องและปรับแต่งตามข้อตกลงทีม |

### Lab 2: Sprint Zero — GitHub Projects Board + Product Backlog
| สมาชิกทีม | เครื่องมือ AI ที่ใช้ | วัตถุประสงค์การใช้งาน | การเปิดเผยและตรวจสอบ |
| :--- | :--- | :--- | :--- |
| **นาย อธิวัฒน์ บวรกิจ** | Antigravity AI | ช่วย Brainstorm หัวข้อฟีเจอร์สำหรับ MoSCoW priorities และช่วยเรียบเรียงร่าง Acceptance Criteria ของ User Stories | ทีมตัดสินใจเลือก Theme/Persona และตรวจสอบเงื่อนไขทุกข้อด้วยตนเอง |
| **สมาชิกทีม CS-Sheet-67** | Antigravity AI | ช่วยร่างโครงสร้างเอกสาร `docs/project-proposal.md` และ `docs/definition-of-done.md` ให้สอดคล้องกับมาตรฐาน Scrum | ตรวจทาน ปรับปรุงเนื้อหาให้ตรงกับบริบทจริงของทีมและผ่าน Code Review ก่อน Merge |

### Lab 3: Requirements Documents (Personas, Scenarios, User Stories, NFR)
| สมาชิกทีม | เครื่องมือ AI ที่ใช้ | วัตถุประสงค์การใช้งาน | การเปิดเผยและตรวจสอบ |
| :--- | :--- | :--- | :--- |
| **นาย อธิวัฒน์ บวรกิจ** | Antigravity AI | ช่วยร่างโครงเรื่อง Scenarios (Narrative) และจัดรูปแบบ Given/When/Then ของ Acceptance Criteria | ทีมตรวจสอบตัวอย่างสถานการณ์จริงใน มพ. และปรับแก้เงื่อนไข AC ให้ตรงกับโดเมน |
| **สมาชิกทีม CS-Sheet-67** | Antigravity AI | ช่วยแปลคำอธิบายข้อกำหนด NFR ทั่วไปให้กลายเป็นดัชนีวัดผลเชิงตัวเลข (Measurable Metrics) | ตรวจทานดัชนีวัดผลและปรับค่าเป้าหมายให้สมจริงตามขอบเขตโปรเจกต์ |

### Lab 4: Rapid Prototyping with AI (Tracer Bullet vs Prototype)
* **เครื่องมือ GenAI ที่ใช้:** Antigravity AI / GitHub Copilot
* **สัดส่วนการเขียนโค้ด:** ทีมงานเขียนโค้ด ปรับแก้ UX/UI สไตล์ CSS และควบคุมสถาปัตยกรรมอีเวนต์ด้วยตนเอง **≥ 60%**, ใช้ AI ช่วยสร้าง HTML/CSS Layout Skeleton **~40%**

### Lab 5: Architectural Artifacts (Tech Stack + C4 Diagrams + ADR)
* **เครื่องมือ GenAI ที่ใช้:** Antigravity AI / Claude
* **สัดส่วนผลงาน:** ทีมงานวิเคราะห์ Trade-offs สรุปบริบทข้อจำกัด และตัดสินใจเลือกสถาปัตยกรรมด้วยตนเอง **100%**, ใช้ AI ช่วยตรวจสอบไวยากรณ์ Mermaid Diagram Syntax (`C4Context` / `C4Container`) และ Challenge ผลกระทบใน ADR 0001

### Lab 6: First Container (Dockerfile + Build + Push)
* **เครื่องมือ GenAI ที่ใช้:** Antigravity AI / GitHub Copilot
* **สัดส่วนผลงาน:** ทีมงานกำหนดนโยบาย Security (Non-root user), เลือก Base Image (`node:20-alpine`) และทดสอบการรัน Container ด้วยตนเอง **≥ 70%**, ใช้ AI ช่วยร่างเค้าโครง Multi-stage Build **~30%**

### Lab 7: Refactoring Commit & Milestone 1 Checkpoint
* **เครื่องมือ GenAI ที่ใช้:** Antigravity AI / GitHub Copilot
* **สัดส่วนการเขียนโค้ด:** ทีมงานวิเคราะห์ Code Smells เขียนย้ายโค้ด Refactor และเขียน Unit Test ใน `tests/notes.test.js` ด้วยตนเอง **≥ 75%**, ใช้ AI ช่วยสแกนหาจุด Duplicated Logic **~25%**

#### ตัวอย่าง Prompts ที่ใช้สำหรับ Refactoring (Lab 7):
1. **Prompt 1 (List Code Smells - SCG Ch.7 Workflow):**
   > *"วิเคราะห์ซอร์สโค้ดในโปรเจกต์ UP-Notes แล้วช่วยระบุตำแหน่ง Code Smell 2 จุดหลักที่มีความซ้ำซ้อนของลอจิก (DRY Violations) และการใช้ Magic Numbers พร้อมเสนอแนวทางแก้ไข"*
2. **Prompt 2 (Propose Refactor Strategy):**
   > *"เสนอแนวทางการสกัดฟังก์ชันค้นหากรองโน้ตย่อและตรวจสอบขนาดไฟล์อัปโหลดออกมาเป็น Pure Utility Functions ในไฟล์ `src/utils/notesHelper.js` โดยไม่มีการดัดแปลง Behavior เดิม"*
3. **Prompt 3 (Unit Test Cases Suggestion):**
   > *"ช่วยแนะนำโครงสร้าง Unit Test Cases สำหรับทดสอบฟังก์ชัน `validateUploadFile` และ `filterNotesBySearch` ด้วย Node.js Native Test Runner (`node:test`)"*

---

### Lab 9: Unit Test + TDD + Property-Based Test + GitHub Actions CI
| สมาชิกทีม | เครื่องมือ AI ที่ใช้ | วัตถุประสงค์การใช้งาน | การเปิดเผยและตรวจสอบ |
| :--- | :--- | :--- | :--- |
| **นาย อธิวัฒน์ บวรกิจ** | Claude Code (Claude Sonnet 5) | ร่าง Unit Test (Equivalence Partitioning + Boundary), TDD kata FizzBuzz (Red-Green-Refactor), Property-Based Test (`fast-check`), GitHub Actions workflow, และ Mutation Testing setup (Stryker) ตาม branch `feature/lab9-testing` | ทีมต้อง**อ่านและทำความเข้าใจทุกไฟล์ก่อน merge** — ดู "หมายเหตุสำคัญ" ด้านล่าง |

#### Prompts ที่ใช้ (Lab 9):
1. **Prompt 1 (Generate test cases):**
   > *"อ่านไฟล์ Lab9.md แล้ววางแผนการทำงานกับโปรเจคนี้"* — ตามด้วยการยืนยันแผนทีละขั้น (เฟรมเวิร์กทดสอบ node:test + fast-check, ฟังก์ชันเป้าหมาย `validateUploadFile` / `calculatePopularityScore`) แล้วให้ AI เขียน Unit Test, TDD kata, และ Property-Based Test ตามแผนที่ตกลงกัน
2. **Prompt 2 (Identify gaps — ใช้เครื่องมือแทน prompt ข้อความ):**
   > รัน `npx stryker run` (Mutation Testing) เพื่อให้เครื่องมือระบุจุดที่ test ยังไม่ครอบคลุม behavior จริง — รอบแรกพบ 19 mutants ที่ "survived" ใน `filterNotesBySearch` (การเทียบ category, การ trim query, การจับคู่ตัวพิมพ์เล็ก-ใหญ่)
3. **Prompt 3 (Review quality via Saboteur Testing):**
   > จงใจแก้ `validateUploadFile` จาก `>` เป็น `>=` แล้วรัน test suite เพื่อตรวจสอบว่า test ที่มีอยู่จับ behavior ผิดพลาดได้จริงหรือไม่ (ไม่ใช่แค่ผ่านเฉยๆ) — ผลลัพธ์บันทึกไว้ใน `docs/saboteur-journal.md`

#### ⚠️ หมายเหตุสำคัญ (Important caveat — ต้องอ่านก่อน merge):
เนื่องจาก Lab 9 นี้ทำร่วมกับ Claude Code ในเซสชันเดียวแบบ end-to-end (จากการวางแผนถึงเขียนไฟล์จริง) โค้ด test ชุดแรกเกือบทั้งหมดถูก AI เขียนร่างให้ ทีมจึงกลับมาอ่านทุกไฟล์และเพิ่ม/แก้ไขด้วยตัวเองในหลายรอบถัดมา:

| ไฟล์ | AI ร่างไว้ (เดิม) | ทีมเพิ่ม/แก้เอง | รวม |
| :--- | :--- | :--- | :--- |
| `tests/test_unit.test.js` | 9 tests | +3 tests (EP7–EP9: size ผิดปกติ, ไฟล์ไม่มีนามสกุล, ไฟล์มีหลายจุด) | 12 |
| `tests/test_fizzbuzz.test.js` | 5 tests | +32 tests (edge case 0/ติดลบ/ทศนิยม/เลขจำนวนมาก, type-guard tests 8 ตัวสำหรับ input ที่ไม่ใช่ตัวเลข เช่น `null`/`[]`/`NaN`, และตัวอย่างเพิ่มเติมในแต่ละ equivalence partition เดิม) | 37 |
| `tests/test_property.test.js` | 4 properties | +7 properties (subset invariant, empty-query invariant บน `filterNotesBySearch`; additive, scaling, zero-identity บน `calculatePopularityScore`; idempotence, case-insensitivity บน `filterNotesBySearch`) | 11 |
| `tests/test_mutation_regression.test.js` | 10 tests | +3 tests ใหม่ (mixed-case query, unknown category, missing/negative size) — ตัว 10 เดิมถูกปรับคำอธิบายเท่านั้น ไม่ได้ออกแบบใหม่ | 13 |
| **รวม** | **28 tests** | **+45 tests/properties** | **73** |

นอกจากนี้ทีมยังแก้ **source code เอง** 2 จุดหลังพบช่องโหว่จากการเขียน test เพิ่ม: เพิ่ม guard clause ใน `src/fizzbuzz.js` (ปฏิเสธ input ที่ไม่ใช่จำนวนเต็มบวก) และใน `src/utils/notesHelper.js` (ปฏิเสธ `size` ที่ติดลบ/ไม่มีค่า)

**สรุปตรงไปตรงมา:** นับตามจำนวน test case ที่ทีมเขียน/แก้เองเทียบกับที่ AI ร่างไว้ (45/73) อยู่ที่ประมาณ **62%** ของชุดทดสอบ Lab 9 ทั้งหมด — **ผ่านเกณฑ์ "ห้ามปล่อยให้ test เขียนเอง < 50%"** ของวิชา

**ข้อสังเกตเพื่อความโปร่งใส:** ตัวเลข 62% นี้นับจากจำนวน test case ที่ทีมพิมพ์เอง ไม่ใช่ทุกตัวมีน้ำหนักด้าน coverage เท่ากัน — ส่วนที่เพิ่ม "partition ใหม่จริง" คือ type-guard tests ใน `test_fizzbuzz.test.js` (8 ตัว) และ properties ใหม่ 7 ตัวใน `test_property.test.js` (เป็นการออกแบบ invariant เอง ไม่ใช่แค่ type check) ส่วนตัวอย่างตัวเลขอื่น ๆ ที่เพิ่มใน `test_fizzbuzz.test.js` (เช่น `fizzbuzz(2)`, `fizzbuzz(30)`) เป็นตัวอย่างเสริมใน equivalence partition เดิมที่มีอยู่แล้ว (ไม่ใช่ partition ใหม่) แต่ยังคงเป็นโค้ดที่ทีมพิมพ์และตัดสินใจเองทั้งหมด ไม่ใช่ AI-draft

---

### Lab 12B (W12) — Safety Net Sprint
| สมาชิกทีม | เครื่องมือ AI ที่ใช้ | วัตถุประสงค์การใช้งาน | การเปิดเผยและตรวจสอบ |
| :--- | :--- | :--- | :--- |
| **นาย อธิวัฒน์ บวรกิจ** | Claude Code (Claude Sonnet 5) | อ่าน `Lab12.md` + วางแผนงานเทียบกับสถานะโปรเจกต์จริง, สรุปผลเทสต์/coverage/mutation testing ที่ทีมทำไว้แล้วจาก Lab 9 ให้เป็น `docs/safety-net.md`, และร่างหัวข้อนี้ใน `AI_USAGE.md` | **ไม่มีการให้ AI เขียนเทสต์ใหม่ในสปรินต์นี้** — 78 unit tests + mutation testing ทำเสร็จไปแล้วจริงในสปรินต์ Lab 9 (ดูหัวข้อด้านบน); งานของ Claude ในรอบนี้คือ**สรุปเอกสาร**จากผลรันจริง และ**ตั้งค่า CI** (เพิ่ม job `lint` + `eslint.config.js` — ดู Prompt 3–4) ไม่ได้แตะโค้ดใน `src/` หรือ `tests/` |

#### Prompts ที่ใช้ (Lab 12B):
1. **Prompt 1 (วางแผนงาน):**
   > *"อ่านไฟล์ Lab12.md กับ folder: lab12b-sample-solution แล้ววางแผนการทำงานกับโปรเจคนี้ ตามเนื้อหาใน Lab12.md"* — ให้ AI เทียบเช็กลิสต์ในใบงานกับสถานะ repo จริง (git log, ไฟล์ที่มี/ไม่มี) ก่อนเริ่มลงมือ แทนที่จะทำซ้ำ Phase A–B ที่เสร็จแล้วจาก Lab 9
2. **Prompt 2 (สรุปเอกสาร):**
   > *"เริ่มเลย"* (ยืนยันแผนที่เสนอ) → ให้ AI รัน `npm test` / `npm run test:coverage` จริง แล้วนำตัวเลขจริงมาเขียน `docs/safety-net.md` ตามเทมเพลต 5 หัวข้อของ `Lab12.md` §6.1
3. **Prompt 3 (ตรวจช่องว่าง — Claude Code / Claude Opus 5.5):**
   > *"ตรวจสอบโปรเจคนี้ว่าทำตามเนื้อหาใน Lab12.md ครบรึยัง ขาดอะไรบ้าง อธิบายมา"* — AI พบว่า CI มีแค่ job `test` (ใบงานกำหนด 2 jobs: `lint` + `test`), ยังไม่มี Branch Protection/หลักฐาน block, และยังไม่มี reflect ของ Post-quiz 12
4. **Prompt 4 (เพิ่ม lint job — Claude Code / Claude Opus 5.5):**
   > *"เริ่มเลย"* → AI เปลี่ยน `.github/workflows/test.yml` เป็น `ci.yml` ที่มี 2 jobs (`lint`, `test`), สร้าง `eslint.config.js` (ESLint 9 flat config ไม่พึ่ง plugin) และเปลี่ยนสคริปต์ `npm run lint` จาก `next lint` (ซึ่ง error เพราะยังไม่มีโฟลเดอร์ `app/`) เป็น `npx --yes eslint@9 src tests`

#### ส่วนที่รับจาก AI ตรงๆ (ไม่แก้):
- `eslint.config.js` และ `.github/workflows/ci.yml` — ทีมต้องอ่านและอธิบายได้ว่าแต่ละ rule/step ทำอะไร (อาจารย์ถามได้ทุกจุด ตาม §11.1)
- เครื่องที่ใช้ทำงานรอบนี้ไม่มี Node.js จึง**ยังไม่ได้รัน ESLint บนเครื่อง** — ผลจริงต้องดูจาก job `lint` บน PR

#### ⚠️ หมายเหตุสำคัญ (ต้องอ่านก่อน merge):
`docs/safety-net.md` เป็นเอกสารที่ Claude ร่างให้ทั้งไฟล์จากข้อมูลจริง (ผลเทสต์/coverage/mutation ที่มีอยู่แล้ว) ไม่ใช่ทีมพิมพ์เอง — ตามนโยบายข้อ 11.1 ของ `Lab12.md` ("❌ ให้ AI เขียนเอกสารทั้งไฟล์" ไม่อนุญาต เว้นแต่ทีมอ่านทบทวนและแก้ไขเป็นมุมมองตัวเองก่อนส่ง) **ทีมต้องอ่านทั้งไฟล์และแก้ไขหัวข้อ "5. บทเรียนที่ได้" ให้เป็นคำพูด/มุมมองของทีมเองก่อน merge PR** CI มี job `lint` + `test` ครบแล้ว แต่ Branch Protection (ข้อ 4 ในเอกสาร) ยังทำไม่เสร็จ — ต้องให้เจ้าของ repo ตั้งค่าและแนบหลักฐานเองตามขั้น 5.7–5.8 ของใบงาน ก่อนถือว่า Lab12B สมบูรณ์

---

## 🛡️ การปฏิบัติตามนโยบายความปลอดภัยและจริยธรรม
- ✅ **ไม่มีการแก้ Test เพื่อให้ผ่าน (No Test Tampering):** เขียน Unit Test เพื่อตรวจสอบพฤติกรรมจริงของฟังก์ชัน 100%
- ✅ **ไม่มีการนำข้อมูลส่วนบุคคลของผู้อื่นเข้าสู่ AI:** ไม่มีการอัปโหลดรหัสนิสิต ข้อมูลลับ หรือข้อมูลส่วนตัวของเพื่อนเข้าสู่ AI Chat
- ✅ **ไม่มีการ Copy-paste โค้ดทั้งหมดจาก AI:** โค้ด Refactor และ Unit Test ทุกบรรทัดถูกทบทวน ปรับแต่ง และทดสอบโดยทีมงานด้วยตนเอง
