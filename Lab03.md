# Lab03-W3_Requirements_Documents

# ใบงานปฏิบัติการ Lab 3

# Requirements Documents — Personas, Scenarios, User Stories, NFR

> **รายวิชา**: แนวคิดวิศวกรรมซอฟต์แวร์ · **รหัสวิชา**: 225311
**สัปดาห์ที่ 3 · ภาคเรียนที่ 1 ปีการศึกษา 2569เวลา**: 2 ชั่วโมง (ห้องปฏิบัติการ) · **คะแนน**: 3.5% ของคะแนนรวม
**อาจารย์ผู้สอน**: นาย ธรรมรัตน์ ธรรมา · สาขาวิทยาการคอมพิวเตอร์ คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา
**ส่งงานผ่าน**: GitHub Pull Requests ใน team repository (docs/requirements/) + Issues ใน Project Board
> 

---

## 1. วัตถุประสงค์เชิงพฤติกรรม (Behavioral Objectives)

เมื่อทำ Lab นี้เสร็จ นิสิตสามารถ

1. **สร้าง** Personas ครบ 5 องค์ประกอบ (Personalization, Job, Education, Relevance, Frequency of use) ที่ grounded ใน domain จริง
2. **เขียน** Scenarios เป็น narrative ที่ครอบคลุม happy path และ edge cases
3. **แปลง** Scenarios เป็น User Stories 8–15 เรื่อง ที่ผ่าน INVEST criteria
4. **เขียน** Acceptance Criteria (AC) แบบ Given/When/Then หรือ checklist ที่วัดผลได้
5. **ระบุ** Non-functional Requirements (NFR) ≥ 5 ข้อ ที่ measurable (ไม่ใชน adjective)
6. **ใช้** MoSCoW priorities + Quality bar สู้ feature creep อย่างเป็นระบบ

**สอดคล้องกับ Learning Outcomes**: LO5, LO8

**อ้างอิงเนื้อหาบทเรียน**: บทที่ 3 — วิศวกรรมความต้องการ (Personas, Scenarios, User Stories, NFR)

---

## 2. เนื้อหาที่ต้องอ่านก่อนทำ Lab (Pre-lab Reading)

กรุณาอ่านเนื้อหาก่อนเข้าห้องปฏิบัติการ (อ่านจาก slide deck ของบทที่ 3 หรือ PDF ตำรา):

- **[ESP] Ch.3** §3.3 (Personas), §3.3.4 (Scenarios), §3.4 (User Stories + AC), §3.5 (FR vs NFR)
- **[SE] Ch.4** — Requirements engineering process, Elicitation, Validation
- **[PP] Tip 45** — *The Requirements Pit* (“No one knows exactly what they want”)
- **[PP] Tip 78** — *Work with a User to Think Like a User* (ดูเพิ่ม)
- **[PP] Tip 79** — *Policy Is Metadata* (แยก business rule ออกจาก logic)
- **Project Proposal** (Lab 02) + **Post-quiz 3** (B3 — User Story ที่จะใช้ใน Lab นี้)

**คำถามนำก่อนทำ Lab** (ให้คิดมาก่อนเข้าคาบ):
- *Persona ต่างจาก “ผู้ใช้ทั่วไป” อย่างไร?*
- *ทำไม User Story ต้องมี Acceptance Criteria ที่วัดผลได้?*

---

## 3. เครื่องมือและบัญชีที่ต้องเตรียม (Materials & Tools)

| รายการ | รายละเอียด |
| --- | --- |
| **GitHub Account** | บัญชีส่วนตัว (ใช้ account เดียวกับ Lab 1–2) |
| **GitHub Organization** | สมาชิกของ Org ของรายวิชา (จาก Lab 1) |
| **Team Repository** | ต้องเปิด **Issues** และ **Projects** ใช้งานได้ |
| **Persona หลัก** | จาก Project Proposal (Lab 02) |
| **User Story** | จาก Post-quiz 3 (B3) — 1 เรื่องที่จะขยายเป็น 8–15 stories |
| **Markdown editor** | VS Code หรือ GitHub web editor |
| **(Optional) ผู้ใช้จริง** | เพื่อนนิสิตที่จะใช้แอป, อาจารย์, ผู้ดูแลระบบ — ใช้เป็น proxy สำหรับ user research |

---

## 4. สิ่งที่ต้องส่ง (Deliverables)

ส่งผ่าน **GitHub Pull Requests** ใน repository ของทีม ภายในสิ้นสุด Lab (2 ชม.):

### 4.1 ไฟล์ในโฟลเดอร์ `docs/requirements/`

| ไฟล์ | เนื้อหา | เกณฑ์ |
| --- | --- | --- |
| `personas.md` | 1–3 personas | ครบ 5 องค์ประกอบ × grounded ใน domain จริง |
| `scenarios.md` | 3–4 scenarios/persona | เป็น narrative (เล่าเรื่อง) ครอบคลุม happy path + edge cases |
| `user-stories.md` | 8–15 stories | “As a/I want/So that” + AC (Given/When/Then) + Priority (MoSCoW) + Estimate (S/M/L) |
| `nfr.md` | ≥ 5 NFRs | measurable (ตัวเลขชัด) ครอบคลุม ≥ 4 ประเภท (Performance/Security/Usability/Maintainability) |

### 4.2 GitHub Issues + Project Board

- แต่ละ User Story กลายเป็น 1 Issue ใน Project Board
- Issue link กลับไป scenario ที่มาที่ไป
- Label: `user-story`
- Milestone: Sprint 1 (W3–4)

### 4.3 PR flow

- แต่ละ deliverable ใน PR แยก (`feature/lab3-personas` → `feature/lab3-scenarios` → `feature/lab3-stories` → `feature/lab3-nfr`)
- ผ่าน review + merge เข้า main

---

## 5. ขั้นตอนการปฏิบัติ (Step-by-Step)

> **ก่อนเริ่ม Lab 3** — ตรวจสอบว่านิสิตได้ทำ Post-quiz จากคาบบรรยายแล้ว (จาก §3.7 ในบทเรียน)
- ถ้ายังไม่ได้ทำ → ให้ทำ Post-quiz 3 ข้อ (Magic Shipping + NFR + User Story) ใน 15 นาทีแรกของ Lab
- **User Story** (Post-quiz B3) จะถูกนำไปสร้าง GitHub Issue ใน Sprint 1 ใน Step 12 ด้านล่าง
> 

### Step 1: ทบทวน Project Proposal (10 นาที)

1. ทบทวน Project Proposal จาก Lab 02 — ตกลง Persona หลักร่วมกันในทีม
2. ถ้ายังไม่มี user research จริง — ตั้ง “นิสิตปี 2 คณะเดียวกัน” เป็น persona หลัก 1 ตัว + อาจเพิ่ม persona รอง (เช่น อาจารย์ / ผู้ดูแลระบบ)

### Step 2: สร้าง Personas (20 นาที)

1. สร้าง branch `feature/lab3-personas`
2. เขียน `docs/requirements/personas.md`:
    - **Persona 1**: ชื่อ archetype + (1) Personalization (รายละเอียดส่วนตัว) + (2) Job (ทำอะไร) + (3) Education + (4) Relevance (เกี่ยวกับโปรเจกต์ยังไง) + (5) Frequency of use
    - ทำซ้ำ 1–3 personas
    - ≤ 5 personas ต่อโปรเจกต์ (ESP §3.3)
3. PR + Review + Merge

### Step 3: เขียน Scenarios (25 นาที)

1. สร้าง branch `feature/lab3-scenarios`
2. เขียน `docs/requirements/scenarios.md`:
    - 3–4 scenarios ต่อ persona
    - แต่ละ scenario มี: ชื่อ scenario + persona ที่เกี่ยวข้อง + objective + action sequence (3–7 ขั้น) + ปัญหาที่เจอ + ผลลัพธ์ที่หวัง
    - Scenario ต้อง **narrative** (เล่าเรื่อง) ไม่ใช่ bullet list
3. PR + Review + Merge

### Step 4: สร้าง User Stories + Acceptance Criteria (40 นาที)

1. สร้าง branch `feature/lab3-stories`
2. Highlight **action verbs** ใน scenarios → derive features
3. เขียน 8–15 User Stories ใน `docs/requirements/user-stories.md` ที่ละ:
    
    ```markdown
    ### Story US-01: <title>
    As a [persona name]
    I want [goal]
    So that [benefit]
    
    **Acceptance Criteria** (Given/When/Then หรือ checklist):
    -[ ] AC1: ...
    -[ ] AC2: ...
    -[ ] AC3: ...
    
    **Priority**: Must / Should / Could
    **Estimate**: S / M / L
    ```
    
4. **Cross-check quality bar** (ESP §3.5): Independent / Coherent / Relevant? ถ้าผ่าน 4 คำถามสู้ feature creep แล้ว → ดี
5. สร้าง GitHub Issue สำหรับแต่ละ Story — link กลับไป scenario ที่มาที่ไป; ติด label `user-story`
6. PR + Review + Merge

### Step 5: เขียน NFRs (15 นาที)

1. สร้าง branch `feature/lab3-nfr`
2. เขียน `docs/requirements/nfr.md`:
    - **Performance**: “response time < 2s ที่ p95, dataset ≤ 100 records”
    - **Security**: “รหัสผ่าน ≥ 8 ตัว, session timeout 30 นาที”
    - **Availability**: “uptime ≥ 99% ระหว่าง 8:00–22:00”
    - **Scalability**: “รองรับผู้ใช้พร้อมกัน 100 คน”
    - **Usability**: “ผู้ใช้ใหม่ทำภารกิจหลักสำเร็จ ≤ 3 นาที”
    - ทุก NFR ต้อง **measurable** (ตัวเลขชัด) — ไม่ใช่ “fast” หรือ “secure”
3. PR + Review + Merge

### Step 6: Wrap-up (10 นาที)

1. Retro: User Stories ที่ derive ได้ตรงกับ Proposal ของสัปดาห์ที่ 2 หรือไม่? ถ้ามี scope เปลี่ยน → อัปเดต Proposal ด้วย

---

## 6. เกณฑ์การประเมิน (Rubric)

**ตาราง L3.1 — เกณฑ์การให้คะแนน Lab 3**

| สิ่งที่ส่ง | **Full 3.5%** | **Partial 1.75%** | **None 0%** |
| --- | --- | --- | --- |
| **`personas.md`** | 1–3 personas, ครบ 5 elements | ขาด element ใด element หนึ่ง | ไม่มี |
| **`scenarios.md`** | 3+ scenarios/persona, narrative | scenarios แต่ไม่ narrative | ไม่มี |
| **`user-stories.md`** | 8+ stories มี AC ครบ + quality bar | < 8 stories หรือ AC ไม่ครบ | ไม่มี |
| **`nfr.md`** | 5+ measurable NFR | NFR แต่ vague (เช่น “fast”) | ไม่มี |
| **Issues + Project Board** | Issues link กับ stories, ใน Project Board | Issues ไม่ครบ | ไม่มี Issues |

> **หมายเหตุ**: คะแนนเป็น **Completion and Effort** — เน้นทำครบตามโจทย์ + แสดงให้เห็นว่าตั้งใจ ไม่หักคะแนนรายข้อย่อย เพื่อกระตุ้นให้นิสิตกล้าลอง
> 

---

## 7. นโยบายการใช้ Generative AI (AI Usage Guidance)

| ✅ อนุญาต | ❌ ไม่อนุญาต |
| --- | --- |
| ใช้ AI ช่วย draft scenarios จาก persona (จากนั้นตรวจ + แก้) | ให้ AI ตัดสิน priority/estimate — product decision ของทีม |
| ใช้ AI generate AC ทดสอบ (จาก story + edge case) — แต่ทีมต้อง review | generate persona ที่ไม่ grounded ใน domain จริง |
| ใช้ AI ช่วย phrasing story ให้ชัด (Given/When/Then) | copy-paste ผลงานเพื่อน (ทุกอย่างต้อง align กับทีม) |
| ใช้ AI แปล requirement ที่คลุมเครือเป็น AC วัดผลได้ | วางข้อมูลส่วนตัวของผู้ใช้ (เช่น รหัสนิสิต) ใน persona |

**ต้องเปิดเผย**: ระบุใน PR description ว่าใช้ AI ช่วยอะไร + ตรวจสอบอย่างไร (ดู template `AI_USAGE.md` ในภาคผนวก ง)

---

## 8. ข้อควรระวัง (Common Pitfalls)

> **❌ Persona = คนจริง** (เช่น “สมชาย รหัส 65xxxxx”) — ต้องเป็น archetype (เช่น “น้องมิ้นท์ นิสิตวิศวะปี 2 หอพัก A”)
> 

> **❌ Story เป็น task**: “ทำ UI” ไม่ใช่ story — ต้องมี persona + goal + benefit ครบ
> 

> **❌ AC เป็นแค่ “ใช้งานได้”** — ต้องระบุ measurable behavior (เช่น “ผู้ใช้ใหม่ทำภารกิจหลักสำเร็จ ≤ 3 นาที”)
> 

> **❌ NFR เป็น adjective**: “เร็ว” / “ปลอดภัย” / “ใช้งานง่าย” — ต้องเป็น metric (ตัวเลข + เกณฑ์)
> 

> **❌ Feature creep** — เพิ่ม story ใหม่โดยไม่ผ่าน MoSCoW + quality bar (4 คำถาม)
> 

> **❌ Scope เปลี่ยน แต่ไม่อัปเดต Proposal** — ต้อง sync Proposal ให้ตรงกับ stories ที่ derive ได้
> 

---

## 9. ความท้าทายเพิ่มเติม (Stretch Goals)

สำหรับนิสิตที่ทำเสร็จก่อน — ลองทำเพิ่ม (ไม่บังคับ ไม่คิดคะแนนเพิ่ม):

- **5 Whys exercise** (PP Tip 10) — กับ user stories ที่ ambiguous — ถาม “ทำไม user ต้องการ?” 5 ชั้น
- **As-a-X matrix** — persona × feature grid ดู coverage (ตรวจว่าแต่ละ persona มี stories ครอบคลุม)
- **Out of Scope section** — ใส่ใน proposal ระบุชัดว่า “ไม่ทำ” อะไร (ป้องกัน scope creep)
- **Persona validation** — ถ้ามี user จริงในโดเมน (เช่น เพื่อนนิสิตคนอื่น) ให้สัมภาษณ์สั้น ๆ 5 นาที เพื่อ validate persona

---

## 10. การส่งงาน

1. **Pull Requests** ใน Team Repository — ต้อง merge สำเร็จ 4 PRs (personas, scenarios, stories, nfr)
2. **GitHub Issues** — แต่ละ User Story เป็น 1 Issue ใน Project Board
3. **`reflect.md`** (Post-quiz 3) — merge พร้อม Lab 3 (commit เป็น `feature/exit-ticket-3` แล้ว merge ใน Lab นี้)
4. **AI_USAGE.md** (ถ้ามีการใช้ AI) — ใน root ของ repository

> **Due**: สิ้นสุด Lab ภายใน 2 ชั่วโมง (ไม่รับงานที่ส่งหลังคาบออก นอกจากมีเหตุผลจำเป็น)
> 

---

## 11. เชื่อมโยงบทเรียน

แนวคิดที่ใช้ใน Lab 3 นี้จะถูกนำไปใช้ในบทต่อ ๆ ไป:

- **Personas + Scenarios** → เป็น input สำหรับ **Prototyping** (บทที่ 4) — สร้าง low-fidelity prototype จาก scenarios
- **User Stories** → ใช้ในทุก Sprint ตลอดภาค — Sprint Backlog เริ่มจาก Must-have stories
- **NFR** → ใช้ใน **Architecture** (บทที่ 5) — เป็น constraint สำหรับ tech stack selection
- **Feature Quality Bar** → ใช้ตลอดภาค — ทุก Sprint ก่อนเพิ่ม story ใหม่ต้องผ่าน 4 คำถาม
- **MoSCoW** → ใช้ใน Sprint Planning ตลอด — ตัด Should/Could ก่อนเมื่อ Sprint ไม่ทัน

---

## 12. บรรณานุกรมประจำ Lab

- Sommerville, I. (2019). *Engineering Software Products: An Introduction to Modern Software Engineering*. Pearson. Chapter 3.
- Sommerville, I. (2016). *Software Engineering* (10th ed.). Pearson. Chapter 4.
- Hunt, A., & Thomas, D. (2019). *The Pragmatic Programmer: Your Journey to Mastery* (2nd ed.). Addison-Wesley. Tip 45, 78, 79.
- Cooper, A. (1999). *The Inmates Are Running the Asylum*. Sams Publishing.
- Wake, B. (2003). *INVEST in Good Stories, and SMART Tasks*. XP123.
- Jeffries, R. (2001). *Essential XP: eXtreme Programming*. Cardware.
- ISO/IEC 25010 (2011). *Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models*.
- เอกสารประกอบการสอน บทที่ 3 — วิศวกรรมความต้องการ

---

*ใบงานนี้จัดทำโดย: นาย ธรรมรัตน์ ธรรมา · สาขาวิทยาการคอมพิวเตอร์ คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา · ภาคเรียนที่ 1 ปีการศึกษา 2569*