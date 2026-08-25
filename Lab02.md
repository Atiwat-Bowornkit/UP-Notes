# Lab02-W2_Sprint_Zero_Setup

# ใบงานปฏิบัติการ Lab 2

# Sprint Zero — GitHub Projects Board + Product Backlog

> **รายวิชา**: แนวคิดวิศวกรรมซอฟต์แวร์ · **รหัสวิชา**: 225311
**สัปดาห์ที่ 2 · ภาคเรียนที่ 1 ปีการศึกษา 2569เวลา**: 2 ชั่วโมง (ห้องปฏิบัติการ) · **คะแนน**: 3.5% ของคะแนนรวม
**อาจารย์ผู้สอน**: นาย ธรรมรัตน์ ธรรมา · สาขาวิทยาการคอมพิวเตอร์ คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา
**ส่งงานผ่าน**: GitHub Project Board + Pull Request ในทีม repository บน GitHub Organization ของรายวิชา
> 

---

## 1. วัตถุประสงค์เชิงพฤติกรรม (Behavioral Objectives)

เมื่อทำ Lab นี้เสร็จ นิสิตสามารถ

1. **ตั้งค่า** GitHub Project Board สำหรับทีม พร้อม columns ตาม Scrum workflow
2. **ร่าง** Product Backlog เริ่มต้น 5–10 items พร้อม acceptance criteria ที่ชัดเจน
3. **เขียน** Project Proposal 1 หน้า ครอบคลุม Theme/Persona/Value/MoSCoW/Risks/DoD
4. **ร่วม Sprint Zero role-play** เพื่อตกลง Sprint Backlog + Definition of Done + Daily Standup
5. **ใช้ AI อย่างโปร่งใส** ในการ brainstorm features + acceptance criteria (พร้อมระบุที่มา)

**สอดคล้องกับ Learning Outcomes**: LO4, LO5, LO9

**อ้างอิงเนื้อหาบทเรียน**: บทที่ 2 — กระบวนการพัฒนาซอฟต์แวร์แบบ Agile (Agile Manifesto, Scrum, XP)

---

## 2. เนื้อหาที่ต้องอ่านก่อนทำ Lab (Pre-lab Reading)

กรุณาอ่านเนื้อหาก่อนเข้าห้องปฏิบัติการ (อ่านจาก slide deck ของบทที่ 2 หรือ PDF ตำรา):

- **[ESP] Ch.2** §2.4–2.7 — Scrum roles, events, artefacts, Velocity, Definition of Done
- **[SE] Ch.3** — Scrum, Sprint Planning, Extreme Programming
- **[PP] Tip 83** — *The Essence of Agility* (“Agile is not a noun; Agile is how you do things”)
- **เอกสารประกอบการสอนบทที่ 2** §2.2 (Waterfall → Agile), §2.4 (Scrum), §2.5 (XP)
- **Project_theme.md** — 3 themes พร้อมตัวอย่างโปรเจกต์ (Tools for Modern Learners / Community Connector / Quantified Self Dashboard)

**คำถามนำก่อนทำ Lab** (ให้คิดมาก่อนเข้าคาบ):
- *ถ้าทีมไม่มี DoD ที่ชัดเจน Sprint จะจบลงอย่างไร?*
- *User Story ที่ดีต้องมีองค์ประกอบอะไรบ้าง ต่างจาก Task อย่างไร?*

---

## 3. เครื่องมือและบัญชีที่ต้องเตรียม (Materials & Tools)

| รายการ | รายละเอียด |
| --- | --- |
| **GitHub Account** | บัญชีส่วนตัว (ใช้ account เดียวกับ Lab 1) |
| **GitHub Organization** | สมาชิกของ Org ของรายวิชา (จาก Lab 1) |
| **Team Repository** | Repository ทีมต้องเปิด **Issues** และ **Projects** ให้ใช้งานได้ |
| **GitHub Projects (Beta)** | ใช้ **Board** view — สร้าง project ในระดับ Organization หรือ repo |
| **Project_theme.md** | เอกสาร Theme 3 ตัวเลือก (อ่านล่วงหน้า) |
| **Markdown editor** | VS Code หรือ GitHub web editor (สำหรับ project-proposal.md) |

---

## 4. สิ่งที่ต้องส่ง (Deliverables)

ส่งผ่าน **GitHub Project Board + Pull Request** ใน repository ของทีม ภายในสิ้นสุด Lab (2 ชม.):

### 4.1 GitHub Project Board

- ชื่อ: `<team-name> — SE Concepts`
- Columns: `Backlog → Todo → In Progress → Review → Done`
- เปิด **Insights** เพื่อดู cycle time / velocity (จะใช้ใน Sprint ถัดไป)

### 4.2 Product Backlog (5–10 GitHub Issues)

- ทุก Issue มี **title** (action-oriented, เช่น “As a student, I can filter tasks by subject”)
- **Body** ประกอบด้วย: persona + goal + benefit + acceptance criteria (3–5 ข้อ)
- **Labels**: `theme:<learning|community|self>`, `priority:<high|medium|low>`, `size:<S|M|L>`
- **Milestone**: ใส่ Sprint ที่วางจะทำ (Sprint 1 = W3–4, Sprint 2 = W5–6, …)

### 4.3 `docs/project-proposal.md` (1 หน้า)

- ผ่าน PR review (branch + PR + tag reviewer + merge)

### 4.4 `docs/definition-of-done.md`

- 5+ items ที่จำเพาะกับทีม (อิง ESP §2.4)

---

## 5. ขั้นตอนการปฏิบัติ (Step-by-Step)

> **ก่อนเริ่ม Lab 2** — ตรวจสอบว่านิสิตได้ทำ Post-quiz จากคาบบรรยายแล้ว (จาก §2.8 ในบทเรียน)
- ถ้ายังไม่ได้ทำ → ให้ทำ Post-quiz 3 ข้อ (Sprint Trade-off + Cargo Cult + XP Practice) ใน 15 นาทีแรกของ Lab
- **XP Practice** (Post-quiz B3) จะถูกคัดลอกไปใส่ใน Sprint Backlog ของ Sprint 1 ใน Step 12 ด้านล่าง
> 

### ตอนต้นคาบ (15 นาที) — เลือก Theme + Persona

1. ทีมเลือก Theme จาก Project_theme.md (1 ใน 3) — **ตัดสินใจร่วมกัน ไม่ใช่เพราะเพื่อนเลือก**
2. ตกลง Persona หลัก 1–2 ตัว (อิงจากตัวอย่างใน Project_theme)
3. หัวหน้าทีมเปิด GitHub Project ใหม่ชื่อ `<team-name> — SE Concepts`

### ตั้ง Project Board (15 นาที)

1. ใน GitHub Project → ตั้ง columns: `Backlog → Todo → In Progress → Review → Done`
2. เปิด **Insights** (Settings → Insights) เพื่อ track cycle time

### เขียน Project Proposal (30 นาที)

1. สร้าง branch: `git checkout -b feature/lab2-proposal`
2. สร้างไฟล์ `docs/project-proposal.md` ประกอบด้วย 6 sections:
    
    
    | Section | เนื้อหา |
    | --- | --- |
    | **Theme** | 1 ใน 3 พร้อมเหตุผล (2–3 ประโยค) |
    | **Project name** | ชื่อโปรเจกต์ |
    | **Persona หลัก** | ชื่อ + บริบท (1 paragraph) |
    | **Value proposition** | ปัญหาที่แก้ + คุณค่าที่ user ได้รับ (2–3 ประโยค) |
    | **MoSCoW priorities** | Must / Should / Could / Won’t (this term) — 4–6 features |
    | **Risks & assumptions** | สมมติฐานที่ต้อง validate + ความเสี่ยงที่อาจเจอ |
3. Commit + push + เปิด PR (`base: main`) + tag reviewer ≥ 1 คน
4. ผ่าน review → merge เข้า `main`

### สร้าง Product Backlog (45 นาที)

1. ระดมความคิด features จาก MoSCoW → แตกเป็น 5–10 Issues
2. สร้าง GitHub Issue แต่ละอัน:
    - **Title**: action-oriented (`As a [persona], I want [goal]`)
    - **Body**: persona + goal + benefit + acceptance criteria (3–5 ข้อ)
    - **Labels**: `theme:*`, `priority:*`, `size:*`
    - **Milestone**: Sprint 1 / Sprint 2 / …
3. เพิ่มทุก Issue เข้า Project Board column **Backlog**

### Sprint Zero Planning (15 นาที)

1. ทีมตกลง **Definition of Done** ของทีมเอง — เขียนใน `docs/definition-of-done.md` (5+ items)
2. ทดลอง **Daily Standup** 1 รอบ (จำลอง): ใครทำอะไรเมื่อวาน / วันนี้ / มีอุปสรรคอะไร
3. Retro สั้น ๆ: อะไรที่ทีมตั้งใจทำ Sprint หน้า?

---

## 6. เกณฑ์การประเมิน (Rubric)

**ตาราง L2.1 — เกณฑ์การให้คะแนน Lab 2**

| สิ่งที่ส่ง | **Full 3.5%** | **Partial 1.75%** | **None 0%** |
| --- | --- | --- | --- |
| **GitHub Project Board** | ครบ 5 columns, ≥ 5 Issues, มี labels ครบ | มี board แต่ Issues ไม่ครบ / labels ไม่ครบ | ไม่มี board |
| **`docs/project-proposal.md`** | ครบ 6 sections (Theme/Persona/Value/MoSCoW/Risks/DoD) | ขาด 1–2 sections | ไม่มีไฟล์ |
| **PR workflow** | branch + PR + Review + Merge | มี commit แต่ไม่ผ่าน PR | push ตรง main |
| **Definition of Done** | 5+ items ที่จำเพาะกับทีม | ใช้ template เดิมไม่ปรับ | ไม่มี |

> **หมายเหตุ**: คะแนนเป็น **Completion and Effort** — เน้นทำครบตามโจทย์ + แสดงให้เห็นว่าตั้งใจ ไม่หักคะแนนรายข้อย่อย เพื่อกระตุ้นให้นิสิตกล้าลอง
> 

---

## 7. นโยบายการใช้ Generative AI (AI Usage Guidance)

| ✅ อนุญาต | ❌ ไม่อนุญาต |
| --- | --- |
| ใช้ AI brainstorm features จาก persona | ให้ AI ตัดสิน Theme/Persona (เป็น product decision ของทีม) |
| ใช้ AI เขียน Acceptance Criteria จาก user story (ตรวจทุกข้อ) | copy-paste ผลงานเพื่อน (ทุกอย่างต้อง align กับทีม) |
| ใช้ AI ช่วย estimate effort (S/M/L) — แต่ทีมตัดสินสุดท้าย | สร้าง Issue / PR โดยไม่ให้สมาชิกทีมอ่าน |

**ต้องเปิดเผย**: ระบุใน Proposal หรือ PR description ว่าใช้ AI ช่วยอะไร + ตรวจสอบอย่างไร (ดู template `AI_USAGE.md` ในภาคผนวก ง)

---

## 8. ข้อควรระวัง (Common Pitfalls)

> **❌ Theme เลือกเพราะ “เพื่อนเลือกแล้ว”**
ต้อง align กับทีม + ความสนใจจริง — เปลี่ยน Theme กลางทาง = ต้นทุนสูง
> 

> **❌ Issues เป็น task ไม่ใช่ story**
“ทำ UI” ไม่ใช่ user story — ใช้ template `As a [persona], I want [goal], so that [benefit]`
> 

> **❌ MoSCoW เป็นแค่ list**
ต้องระบุชัดว่าอะไร Must vs Should — เวลามีจำกัด ตัด Should ก่อน
> 

> **❌ ไม่ระบุ Risks**
Assumption ที่ไม่ได้ validate อาจพังทั้งโปรเจกต์ — เขียนอย่างน้อย 2 ข้อ
> 

> **❌ PR description ว่างเปล่า**
Reviewer ไม่รู้ว่าจะดูอะไร — เขียน 2–3 บรรทัดว่าทำอะไร + ทำไม
> 

> **❌ DoD ใช้ template เดิมไม่ปรับ**
DoD ของทีมต้องสะท้อนบริบทจริง (เช่น ทีม distributed ต้องมี “เปิด PR แทน push ตรง main”)
> 

---

## 9. ความท้าทายเพิ่มเติม (Stretch Goals)

สำหรับนิสิตที่ทำเสร็จก่อน — ลองทำเพิ่ม (ไม่บังคับ ไม่คิดคะแนนเพิ่ม):

- **Definition of Ready (DoR)** — เขียนเงื่อนไขที่ Issue ต้องผ่านก่อนเข้า Sprint (เช่น “มี AC ≥ 3 ข้อ”, “estimate แล้ว”, “ไม่มี blocking dependencies”)
- **GitHub Milestones** — ทดลองใช้ Milestone แทน Sprint (1 milestone = 1 Sprint)
- **GitHub Actions** — ตั้ง automation: เมื่อ Issue ถูกปิด → ส่ง notification ไปยัง Slack/Discord ของทีม
- **Velocity Tracking** — เปิด Insights ของ Project Board แล้วบันทึก baseline velocity ของทีม

---

## 10. การส่งงาน

1. **GitHub Project Board** — มี Issues 5–10 รายการ + labels + milestones
2. **`docs/project-proposal.md`** — merge เข้า main ผ่าน PR review
3. **`docs/definition-of-done.md`** — 5+ items
4. **AI_USAGE.md** (ถ้ามีการใช้ AI) — ใน root ของ repository

> **Due**: สิ้นสุด Lab ภายใน 2 ชั่วโมง (ไม่รับงานที่ส่งหลังคาบออก นอกจากมีเหตุผลจำเป็น)
> 

---

## 11. เชื่อมโยงบทเรียน

แนวคิดที่ใช้ใน Lab 2 นี้จะถูกนำไปใช้ตลอดภาคการศึกษา:

- **Scrum (บทที่ 2 §2.4)** → ใช้จัดการ Sprint ในทุก Lab ที่เหลือ (W3–W14)
- **Definition of Done** → ต่อยอดเป็น **Definition of Ready** และ **Acceptance Criteria** ในบทที่ 3 (Requirements)
- **XP Pick-and-Mix (บทที่ 2 §2.5)** → ใช้เลือก engineering practices ที่เหมาะกับทีม (TDD/PAIR/CI ในบทที่ 9–10)
- **Product Backlog + Sprint Planning** → เป็นแกนหลักของ Project Workshop (บทที่ 13) และ Demo Day (บทที่ 14)
- **Cargo Cult Awareness (บทที่ 2 §2.6)** → ใช้ตรวจสอบตัวเองใน Sprint Retrospective

---

## 12. บรรณานุกรมประจำ Lab

- Sommerville, I. (2019). *Engineering Software Products: An Introduction to Modern Software Engineering*. Pearson. Chapter 2.
- Sommerville, I. (2016). *Software Engineering* (10th ed.). Pearson. Chapter 3.
- Schwaber, K., & Sutherland, J. (2020). *The Scrum Guide*. scrumguides.org.
- Beck, K. (1999). *Extreme Programming Explained: Embrace Change*. Addison-Wesley.
- Hunt, A., & Thomas, D. (2019). *The Pragmatic Programmer: Your Journey to Mastery* (2nd ed.). Addison-Wesley. Tip 83.
- GitHub Docs. (2024). *About Projects*. docs.github.com.
- เอกสารประกอบการสอน บทที่ 2 — กระบวนการพัฒนาซอฟต์แวร์แบบ Agile

---

*ใบงานนี้จัดทำโดย: นาย ธรรมรัตน์ ธรรมา · สาขาวิทยาการคอมพิวเตอร์ คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา · ภาคเรียนที่ 1 ปีการศึกษา 2569*