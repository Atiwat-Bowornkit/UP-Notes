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

## 🛡️ การปฏิบัติตามนโยบายความปลอดภัยและจริยธรรม
- ✅ **ไม่มีการแก้ Test เพื่อให้ผ่าน (No Test Tampering):** เขียน Unit Test เพื่อตรวจสอบพฤติกรรมจริงของฟังก์ชัน 100%
- ✅ **ไม่มีการนำข้อมูลส่วนบุคคลของผู้อื่นเข้าสู่ AI:** ไม่มีการอัปโหลดรหัสนิสิต ข้อมูลลับ หรือข้อมูลส่วนตัวของเพื่อนเข้าสู่ AI Chat
- ✅ **ไม่มีการ Copy-paste โค้ดทั้งหมดจาก AI:** โค้ด Refactor และ Unit Test ทุกบรรทัดถูกทบทวน ปรับแต่ง และทดสอบโดยทีมงานด้วยตนเอง
