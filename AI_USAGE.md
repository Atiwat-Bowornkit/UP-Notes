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
เนื่องจาก Lab 9 นี้ทำร่วมกับ Claude Code ในเซสชันเดียวแบบ end-to-end (จากการวางแผนถึงเขียนไฟล์จริง) โค้ด test **เกือบทั้งหมดถูก AI เขียนร่างแรกให้** ซึ่ง**ยังไม่เป็นไปตามนโยบาย "ห้ามปล่อยให้ test เขียนเอง < 50%"** ของวิชา ก่อนส่งงานจริง ทีมต้อง:
1. อ่านทุกไฟล์ทดสอบ (`tests/test_unit.test.js`, `tests/test_fizzbuzz.test.js`, `tests/test_property.test.js`, `tests/test_mutation_regression.test.js`) และทำความเข้าใจว่าแต่ละเทสตรวจ behavior อะไร
2. แก้ไข/เพิ่มเทสด้วยคำพูดและมุมมองของทีมเอง อย่างน้อยให้สัดส่วนงานที่ทีมแก้ไขเองมากกว่า 50%
3. ยืนยันว่า `reflect.md` (Post-quiz 9) เป็นคำตอบจริงของทีม ไม่ใช่ placeholder ที่ AI ร่างไว้

---

## 🛡️ การปฏิบัติตามนโยบายความปลอดภัยและจริยธรรม
- ✅ **ไม่มีการแก้ Test เพื่อให้ผ่าน (No Test Tampering):** เขียน Unit Test เพื่อตรวจสอบพฤติกรรมจริงของฟังก์ชัน 100%
- ✅ **ไม่มีการนำข้อมูลส่วนบุคคลของผู้อื่นเข้าสู่ AI:** ไม่มีการอัปโหลดรหัสนิสิต ข้อมูลลับ หรือข้อมูลส่วนตัวของเพื่อนเข้าสู่ AI Chat
- ✅ **ไม่มีการ Copy-paste โค้ดทั้งหมดจาก AI:** โค้ด Refactor และ Unit Test ทุกบรรทัดถูกทบทวน ปรับแต่ง และทดสอบโดยทีมงานด้วยตนเอง
