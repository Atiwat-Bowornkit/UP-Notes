# Lab04-W4_Rapid_Prototyping_with_AI

# ใบงานปฏิบัติการ Lab 4

# Rapid Prototyping with AI — Tracer Bullet vs Prototype

> **รายวิชา**: แนวคิดวิศวกรรมซอฟต์แวร์ · **รหัสวิชา**: 225311
**สัปดาห์ที่ 4 · ภาคเรียนที่ 1 ปีการศึกษา 2569เวลา**: 2 ชั่วโมง (ห้องปฏิบัติการ) · **คะแนน**: 3.5% ของคะแนนรวม
**อาจารย์ผู้สอน**: นาย ธรรมรัตน์ ธรรมา · สาขาวิทยาการคอมพิวเตอร์ คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา
**ส่งงานผ่าน**: GitHub Pull Request ใน team repository (prototypes/sprint1/) + AI_USAGE.md
> 

---

## 1. วัตถุประสงค์เชิงพฤติกรรม (Behavioral Objectives)

เมื่อทำ Lab นี้เสร็จ นิสิตสามารถ

1. **แยกความต่าง** ระหว่าง Tracer Bullet กับ Prototype ในบริบทของ Sprint 1 ได้
2. **เขียน prompt** ตามหลัก Five S’s (SCG Ch.4) ที่ให้ AI generate code ที่ตรง spec
3. **ใช้ GenAI** (Copilot/ChatGPT) เป็น co-pilot ไม่ใช่ ghost writer — เขียนเอง ≥ 50% ของ code
4. **สร้าง** interactive prototype (HTML/CSS/JS) ที่รันได้จริงใน browser
5. **ระบุ** Tracer vs Prototype พร้อมเหตุผล และขอบเขตสิ่งที่ “ไม่ได้ทำ”
6. **เปิดเผย** การใช้ AI ใน `AI_USAGE.md` (tools + prompts + ส่วนที่รับจาก AI)

**สอดคล้องกับ Learning Outcomes**: LO5, LO7

**อ้างอิงเนื้อหาบทเรียน**: บทที่ 4 — การสร้างต้นแบบและการพัฒนาโดยใช้ Generative AI

---

## 2. เนื้อหาที่ต้องอ่านก่อนทำ Lab (Pre-lab Reading)

กรุณาอ่านเนื้อหาก่อนเข้าห้องปฏิบัติการ (อ่านจาก slide deck ของบทที่ 4 หรือ PDF ตำรา):

- **[PP] Tip 20** — *Tracer Bullets* (end-to-end ที่ต่อยอดได้)
- **[PP] Tip 21** — *Prototype* (เขียนเพื่อเรียนรู้ ทิ้งได้)
- **[PP] Tip 61** — *“It’s Playtime!”* technique (ปลดล็อก writer’s block)
- **[ESP] §1.3** — Two-stage prototyping (feasibility → customer demo)
- **[SCG] Ch.4** — Five S’s prompting (Structured, Surrounding, Single task, Specific, Short)
- **[SCG] Ch.5** — Copilot / ChatGPT modes (AI as co-pilot)

**คำถามนำก่อนทำ Lab** (ให้คิดมาก่อนเข้าคาบ):
- *ทีมของคุณจะใช้ Tracer Bullet หรือ Prototype ใน Sprint 1? ทำไม?*
- *Prompt อะไรจะให้ AI generate HTML/CSS ที่ตรง spec ที่สุด?*

---

## 3. เครื่องมือและบัญชีที่ต้องเตรียม (Materials & Tools)

| รายการ | รายละเอียด |
| --- | --- |
| **GitHub Account** | บัญชีส่วนตัว (ใช้ account เดียวกับ Lab 1–3) |
| **GitHub Organization** | สมาชิกของ Org ของรายวิชา (จาก Lab 1) |
| **Team Repository** | ต้อง push folder `prototypes/sprint1/` ได้ |
| **GenAI Tool** | GitHub Copilot (IDE) หรือ ChatGPT (web) — เลือก 1 ตัว |
| **Text Editor / IDE** | VS Code (recommended) หรือ text editor อื่น |
| **Browser** | Chrome / Firefox / Edge — ต้องทดสอบ prototype |
| **User Story** | จาก Lab 3 (Sprint 1, Must priority) — 1 เรื่อง |

---

## 4. สิ่งที่ต้องส่ง (Deliverables)

ส่งผ่าน **GitHub Pull Request** ใน repository ของทีม ภายในสิ้นสุด Lab (2 ชม.):

### 4.1 ไฟล์ที่ต้องมี

| ไฟล์ | เนื้อหา | เกณฑ์ |
| --- | --- | --- |
| `prototypes/sprint1/index.html` | หน้าหลัก interactive (HTML/CSS/JS) | รันได้จริงใน browser — มี form/button/state change |
| `prototypes/sprint1/README.md` | ระบุ Tracer vs Prototype + เหตุผล + ขอบเขต | ชัดเจน + มีเหตุผล |
| `prototypes/sprint1/style.css` (optional) | CSS แยกไฟล์ | ถ้าแยกจาก HTML |
| `prototypes/sprint1/script.js` (optional) | JS แยกไฟล์ | ถ้าแยกจาก HTML |
| `AI_USAGE.md` (root) | อัปเดต: tools + prompts + ส่วนที่รับจาก AI | ครบทั้ง 3 sections |

### 4.2 PR Workflow

- Branch: `feature/lab4-prototype-<feature-short-name>`
- ต้องมี **screenshots/GIF** ใน PR description
- ผ่าน review + merge เข้า main

---

## 5. ขั้นตอนการปฏิบัติ (Step-by-Step)

> **ก่อนเริ่ม Lab 4** — ตรวจสอบว่านิสิตได้ทำ Post-quiz จากคาบบรรยายแล้ว (จาก §4.7 ในบทเรียน)
- ถ้ายังไม่ได้ทำ → ให้ทำ Post-quiz 3 ข้อ (Prompt Critique + AI in real life + AI Strategy) ใน 15 นาทีแรกของ Lab
- **Prompt Critique** (Post-quiz B1) จะถูกนำไปเป็น starter สำหรับ Lab 4 — สร้าง prototype จริง
> 

### Step 1: เลือก User Story (10 นาที)

1. ทีมเลือก **1 user story** ที่ Must priority (จาก Lab 3) เพื่อทำ prototype
2. ระบุชัด: นี่คือ **Prototype** (ทิ้งได้) หรือ **Tracer Bullet** (เดินต่อได้)?
    - ถ้าทีมยังไม่แน่ใจ user flow → **Prototype** (ตอบคำถาม “เข้าใจไหม”)
    - ถ้าทีมพอใจ user flow แล้ว → **Tracer Bullet** (ต่อ Sprint 2 จะ build ต่อ)

### Step 2: ร่าง Prompt ตาม Five S’s (20 นาที)

1. ทีมร่าง prompt ตาม Five S’s (SCG Ch.4) — ตัวอย่าง:
    
    ❌ Bad: “ช่วยทำ UI หน่อย”
    ✅ Better: “สร้าง HTML สำหรับ todo list ที่: (1) มี text input + ปุ่ม Add, (2) คลิก item แล้วขีดฆ่า, (3) ใช้ plain CSS ไม่ต้องมี framework; ใช้ semantic HTML (header/main/ul/li)”
    
2. ทดลอง prompt ของจริงกับ AI ดู — ถ้า output ไม่ดี iterate 2–3 รอบ
3. **บันทึก prompt และ output** ใน `AI_USAGE.md`

### Step 3: สร้าง Prototype (60 นาที)

1. สร้าง branch `feature/lab4-prototype-<feature>`
2. สร้าง folder `prototypes/sprint1/`
3. เขียน `index.html` (single file หรือแยก CSS/JS ก็ได้):
    - ใช้ **semantic HTML** (header/main/section/article)
    - **CSS** เขียนเองหรือให้ AI ช่วย — ห้ามใช้ external framework (no React/Vue/Bootstrap — เพราะจะทำให้ทีมสับสน)
    - **JS** ทำ interactive behavior (form submit, click toggle, dynamic list)
4. ทดสอบใน browser — ต้อง **รันได้จริง** (โดยไม่ต้องเปิด console)
5. **เขียนเอง ≥ 50%** ของ code (ดู AI Usage guidance) — ส่วนที่ AI generate ต้อง review + ปรับ

### Step 4: ส่งงาน (30 นาที)

1. Screenshots/GIF ของ prototype ที่รัน — ใส่ใน PR description
2. เขียน `prototypes/sprint1/README.md`:
    - **ชื่อ feature** + user story ที่อ้าง
    - **Tracer vs Prototype**: ระบุชัด
    - **สิ่งที่ทำได้**: 2–3 ข้อ
    - **สิ่งที่ไม่ได้ทำ** (deliberately): security/responsive/full data ฯลฯ
    - **Next step**: จะทำอะไรต่อ Sprint 2
3. PR + Review + Merge

---

## 6. เกณฑ์การประเมิน (Rubric)

**ตาราง L4.1 — เกณฑ์การให้คะแนน Lab 4**

| สิ่งที่ส่ง | **Full 3.5%** | **Partial 1.75%** | **None 0%** |
| --- | --- | --- | --- |
| **Interactive prototype รันได้** | HTML/CSS/JS ทำงานจริง ≥ 1 user flow | HTML มีแต่ไม่ interactive | ไม่มีไฟล์ |
| **README ระบุ Tracer vs Prototype** | ชัดเจน + เหตุผล + ขอบเขต | ระบุแต่ไม่มีเหตุผล | ไม่มี |
| **AI Usage disclosure** | ครบ (tools + prompts + ส่วนที่รับ AI) | ขาด prompts หรือ ส่วนที่รับ | ไม่มี |
| **PR workflow** | branch + PR + Review + Merge + screenshots | ขาด review/screenshots | push ตรง main |

> **หมายเหตุ**: คะแนนเป็น **Completion and Effort** — ต้องได้ครบทั้ง 4 ข้อถึงได้ 3.5% (ไม่หักคะแนนรายข้อย่อย) เพื่อกระตุ้นให้นิสิตทำครบ + แสดงให้เห็นว่าตั้งใจ
> 

---

## 7. นโยบายการใช้ Generative AI (AI Usage Guidance)

| ✅ อนุญาต | ❌ ไม่อนุญาต |
| --- | --- |
| ใช้ AI generate HTML/CSS skeleton (จาก prompt ที่ดี) | **ห้าม** copy ทั้งหมดโดยไม่แก้ — ต้องมี personal touches / domain-specific |
| ใช้ AI อธิบาย snippet ที่ไม่เข้าใจ | **ห้าม** ส่ง production code (ยังไม่มี test ยังไม่มี review) |
| ใช้ AI suggest CSS styling ที่ดูดี | **ห้าม** วาง user data จริง (เช่น รหัสนิสิต) ใน AI chat — PDPA |
| ใช้ AI iterate prompt 2–3 รอบเพื่อ refine output | ห้ามใช้ AI แทนการเขียนเอง 100% — ต้องเขียนเอง ≥ 50% |

**ต้องเปิดเผย** ใน `AI_USAGE.md`:
- เครื่องมือ: <Copilot/ChatGPT/etc.>
- Prompts ที่ใช้ (≥ 2 prompts)
- ส่วนที่รับจาก AI ตรงๆ (ไม่แก้)

---

## 8. ข้อควรระวัง (Common Pitfalls)

> **❌ ใช้ framework หนัก** (React/Vue/Bootstrap) — ทำให้ scope บานปลาย + ทีมสับสน
> 

> **❌ AI ทำทั้งหมด** — โดนหักคะแนน “เขียนเอง ≥ 50%” (ดู Rubric)
> 

> **❌ README ไม่ระบุ Tracer vs Prototype** — แสดงว่าไม่เข้าใจความต่าง
> 

> **❌ Prototype ที่ “ดูดี” แต่ไม่ interactive** — ไม่ผ่าน “interactive” เกณฑ์
> 

> **❌ ไม่ระบุขอบเขต** (“ไม่ได้ทำ security”) — ผู้ตรวจไม่รู้ว่าคาดหวังอะไร
> 

> **❌ ใช้ AI ทุกขั้นตอน** — prompt ควรมาจากการคิดของทีม, AI แค่ช่วย translate เป็น code
> 

> **❌ ส่ง production code ใน Lab 4** — ยังไม่มี test, ไม่มี review, ไม่มี security
> 

---

## 9. ความท้าทายเพิ่มเติม (Stretch Goals)

สำหรับนิสิตที่ทำเสร็จก่อน — ลองทำเพิ่ม (ไม่บังคับ ไม่คิดคะแนนเพิ่ม):

- **Mobile responsive** — เพิ่ม CSS media queries
- **2 หน้า** (list → detail) — เพิ่ม navigation
- **LocalStorage** — เก็บ state ข้าม refresh
- **Property test** (PP T71) — ทดสอบ business rule ง่ายๆ
- **Accessibility** — เพิ่ม ARIA labels, keyboard navigation
- **AI_USAGE.md** — compare prompts ที่ใช้จริง vs prompts ที่ใช้ใน Post-quiz → reflect

---

## 10. การส่งงาน

1. **Pull Request** ใน Team Repository — ต้อง merge สำเร็จ
2. **`prototypes/sprint1/index.html`** — รันได้จริง
3. **`prototypes/sprint1/README.md`** — ระบุ Tracer vs Prototype + เหตุผล + ขอบเขต
4. **`AI_USAGE.md`** (root) — อัปเดต tools + prompts + ส่วนที่รับ AI
5. **`reflect.md`** (Post-quiz 4) — merge พร้อม Lab 4 (commit เป็น `feature/exit-ticket-4` แล้ว merge ใน Lab นี้)

> **Due**: สิ้นสุด Lab ภายใน 2 ชั่วโมง (ไม่รับงานที่ส่งหลังคาบออก นอกจากมีเหตุผลจำเป็น)
> 

---

## 11. เชื่อมโยงบทเรียน

แนวคิดที่ใช้ใน Lab 4 นี้จะถูกนำไปใช้ตลอดภาคการศึกษา:

- **Tracer vs Prototype** → ใช้ตัดสินในทุก Sprint — “Prototype ก่อน แล้วค่อยต่อยอดเป็น Tracer Bullet”
- **Five S’s Prompting** → ใช้กับทุก task ที่ใช้ AI (Architecture, Testing, Documentation)
- **AI as Co-pilot** → ใช้ในทุกขั้นตอน SDLC แต่ต้อง review + test ทุกครั้ง
- **AI_USAGE.md** → ใช้ในทุก Lab / Sprint — ต้องอัปเดต
- **Post-quiz** → ใช้ในทุกบทเพื่อเตรียม Sprint ถัดไป

---

## 12. บรรณานุกรมประจำ Lab

- Hunt, A., & Thomas, D. (2019). *The Pragmatic Programmer: Your Journey to Mastery* (2nd ed.). Addison-Wesley. Tip 20, 21, 61.
- Sommerville, I. (2019). *Engineering Software Products: An Introduction to Modern Software Engineering*. Pearson. Section 1.3.
- Herszfang, H. P., & Henstock, P. V. (2025). *Supercharged Coding with GenAI*. Packt Publishing. Chapters 4–5.
- เอกสารประกอบการสอน บทที่ 4 — การสร้างต้นแบบและการพัฒนาโดยใช้ Generative AI

---

*ใบงานนี้จัดทำโดย: นาย ธรรมรัตน์ ธรรมา · สาขาวิทยาการคอมพิวเตอร์ คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา · ภาคเรียนที่ 1 ปีการศึกษา 2569*