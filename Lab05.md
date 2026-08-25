# Lab05-W5_Architectural_Artifacts

# ใบงานปฏิบัติการ Lab 5

# Architectural Artifacts — Tech Stack + C4 Diagrams + ADR

> **รายวิชา**: แนวคิดวิศวกรรมซอฟต์แวร์ · **รหัสวิชา**: 225311
**สัปดาห์ที่ 5 · ภาคเรียนที่ 1 ปีการศึกษา 2569เวลา**: 2 ชั่วโมง (ห้องปฏิบัติการ) · **คะแนน**: 3.5% ของคะแนนรวม
**อาจารย์ผู้สอน**: ธรรมรัตน์ ธรรมา · สาขาวิทยาการคอมพิวเตอร์ คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา
**ส่งงานผ่าน**: GitHub Pull Request ใน team repository (docs/architecture/) + reflect.md จาก Post-quiz 5
> 

---

## 1. วัตถุประสงค์เชิงพฤติกรรม (Behavioral Objectives)

เมื่อทำ Lab นี้เสร็จ นิสิตสามารถ

1. **วิเคราะห์** Architectural trade-offs โดยใช้ 5 คำถามของ Sommerville (NFR · lifetime · reuse · users · compatibility)
2. **เลือกใช้** architectural pattern ที่เหมาะสม (Layered / Multi-tier / Service-oriented / Monolith vs Microservices) — เหตุผลเชิง context
3. **สร้าง** C4 Context (Level 1) + Container (Level 2) diagrams ด้วย Mermaid ที่ render ได้ใน GitHub
4. **เขียน** ADR ฉบับแรกของทีมตาม Michael Nygard format (Status · Context · Decision · Consequences · Alternatives)
5. **สรุป** tech stack พร้อม rationale + alternative ต่อ layer (อย่างน้อย 5 layer)
6. **เปิดเผย** การใช้ AI ใน `AI_USAGE.md` (tools + prompts + ส่วนที่รับจาก AI)

**สอดคล้องกับ Learning Outcomes**: LO2, LO8

**อ้างอิงเนื้อหาบทเรียน**: บทที่ 5 — สถาปัตยกรรมซอฟต์แวร์

---

## 2. เนื้อหาที่ต้องอ่านก่อนทำ Lab (Pre-lab Reading)

กรุณาอ่านเนื้อหาก่อนเข้าห้องปฏิบัติการ (อ่านจาก slide deck ของบทที่ 5 หรือ PDF ตำรา):

- **[ESP] Ch.4** — Software Architecture (5-layer Generic Model, MVC, Multi-tier vs Service-oriented, Architectural trade-offs)
- **[SE] Ch.6** — Architectural design, Architectural patterns, 4+1 view
- **[Nygard 2011]** — ADR (Architecture Decision Record) Michael Nygard 5-section format
- **[Brown 2011]** — C4 Model: Context / Container / Component / Code
- **[Lewis & Fowler 2014]** — Microservices definition
- **ทีมของคุณ’s User Stories** (จาก Lab 3) — โดยเฉพาะ Must priority

**คำถามนำก่อนทำ Lab** (ให้คิดมาก่อนเข้าคาบ):
- *ทีมจะเลือก Monolith หรือ Microservices — เพราะเหตุผลเชิง context อะไร? (ทีม/เวลา/scale/ops)*
- *Tech stack หลักของทีม (Frontend / Backend / Database) คืออะไร — rationale เป็น context ไม่ใช่แค่ “ถนัด”?*

---

## 3. เครื่องมือและบัญการที่ต้องเตรียม (Materials & Tools)

| รายการ | รายละเอียด |
| --- | --- |
| **GitHub Account** | บัญชีส่วนตัว (ใช้ account เดียวกับ Lab 1–4) |
| **GitHub Organization** | สมาชิกของ Org ของรายวิชา (จาก Lab 1) |
| **Team Repository** | ต้อง push folder `docs/architecture/` ได้ |
| **Diagram Tool** | แนะนำ **Mermaid ใน Markdown** — render อัตโนมัติใน GitHub; หรือ draw.io / Excalidraw สำหรับ export |
| **Mermaid Syntax** | ดู https://mermaid.js.org/syntax/c4.html (สำหรับ `C4Context` / `C4Container`) |
| **Post-quiz 5** | `reflect.md` จากคาบบรรยาย (ADR draft + C4 + Tech Stack) |

---

## 4. สิ่งที่ต้องส่ง (Deliverables)

ส่งผ่าน **GitHub Pull Request** ใน repository ของทีม ภายในสิ้นสุด Lab (2 ชม.):

### 4.1 ไฟล์ที่ต้องมี

| ไฟล์ | เนื้อหา | เกณฑ์ |
| --- | --- | --- |
| `docs/architecture/c4-context.md` | C4 Level 1 — System Context diagram (Mermaid) | render ถูก · มี user + external systems |
| `docs/architecture/c4-container.md` | C4 Level 2 — Container diagram (Mermaid) | render ถูก · มี 3–4 container พร้อม technology label |
| `docs/architecture/tech_stack.md` | ตารางสรุป stack ต่อ layer + rationale + alternative | อย่างน้อย 5 layer · rationale เชิง context |
| `docs/architecture/adr/0001-*.md` | ADR แรกของทีม (Michael Nygard 5 sections) | หัวข้อ: Monolith vs Microservices / Database choice / Frontend framework |
| `AI_USAGE.md` (root) | อัปเดต: tools + prompts + ส่วนที่รับจาก AI | ครบทั้ง 3 sections |
| `reflect.md` (root) | Post-quiz 5 (merge จาก feature branch) | 3 reflection (ADR + C4 + Tech Stack) |

### 4.2 PR Workflow

- Branch: `feature/lab5-architecture`
- ต้อง merge `reflect.md` (Post-quiz 5) เข้ามาพร้อม
- ต้องมี **screenshots** ของ Mermaid diagram ที่ render แล้ว (จาก GitHub preview) ใน PR description
- ผ่าน review + merge เข้า main

---

## 5. ขั้นตอนการปฏิบัติ (Step-by-Step)

> **ก่อนเริ่ม Lab 5** — ตรวจสอบว่านิสิตได้ทำ Post-quiz จากคาบบรรยายแล้ว (จาก §5.7 ในบทเรียน)
- ถ้ายังไม่ได้ทำ → ให้ทำ Post-quiz 3 ข้อ (ADR draft + C4 + Tech Stack) ใน 15 นาทีแรกของ Lab
- **ADR (B1)** จะถูกขยายเป็น ADR 0001 ฉบับเต็ม — **C4 (B2)** จะกลายเป็น starter สำหรับ `c4-context.md` + `c4-container.md`
> 

### Step 1: ทบทวน User Stories + ระบุปัญหาการตัดสินใจ (15 นาที)

1. ทบทวน User Stories (จาก Lab 3) — โดยเฉพาะ Must priority
2. ระบุปัญหาหลักที่ต้องตัดสินใจทางสถาปัตยกรรม:
    - **Monolith หรือ Microservices?** (ESP §4.6 · ดู 5 คำถาม trade-off)
    - **Stateful หรือ Stateless**?
    - **Sync หรือ Async communication**?
    - **ฐานข้อมูล**: relational (PostgreSQL/MySQL) หรือ NoSQL (MongoDB/Firestore)?
    - **Deployment**: Cloud (Render/Railway/Fly) หรือ Self-hosted?

### Step 2: Tech Stack (25 นาที)

1. Branch `feature/lab5-architecture`
2. สร้าง `docs/architecture/tech_stack.md` — ตารางอย่างน้อย 5 layer:
    
    
    | Layer | Choice | Rationale | Alternative |
    | --- | --- | --- | --- |
    | Frontend | React + Vite | ecosystem ใหญ่ + ทีมมีคนเคย | Vue/Svelte/Next.js |
    | Backend | Node.js + Express | ทีมคุ้นเคย + middleware หลากหลาย | Python FastAPI / Go |
    | Database | PostgreSQL | structured + ACID + JSON support | MongoDB / SQLite |
    | Hosting | Docker + Render | scale ง่าย + free tier เริ่มต้น | AWS ECS / Fly.io |
    | Auth | JWT | stateless + ใช้ได้กับ web/mobile | OAuth2 / Session |
3. **Rationale ต้องเป็นเหตุผลเชิง context** ไม่ใช่แค่ “เพราะทีมถนัด” — ระบุ: scale, deployment target, existing infra, NFR

### Step 3: C4 Diagrams (40 นาที)

1. **Context (Level 1)**: ใครใช้ระบบ? ระบบคุ่ยกับ external system อะไร?
    
    ```mermaid
    C4Context
        Person(student, "Student", "ใช้ Pomodoro เพื่อจับเวลาเรียน")
        System(pomodoro, "Pragmatic Pomodoro", "Web app จับเวลา + To-do list")
        System_Ext(line, "LINE Notify", "ส่ง notification เมื่อจบ session")
        Rel(student, pomodoro, "Uses")
        Rel(pomodoro, line, "ส่ง notification ผ่าน")
    ```
    
2. **Container (Level 2)**: ระบบประกอบด้วยอะไร (web app, API, database, external services)?
    
    ```mermaid
    C4Container
        Person(user, "User")
        Container(web, "Web App", "React", "หน้าจอหลัก")
        Container(api, "API Server", "Node.js + Express", "REST API")
        ContainerDb(db, "Database", "PostgreSQL", "เก็บ tasks/sessions")
        System_Ext(line, "LINE Notify")
        Rel(user, web, "Uses", "HTTPS")
        Rel(web, api, "Calls", "HTTPS/JSON")
        Rel(api, db, "Reads/Writes")
        Rel(api, line, "Sends notification")
    ```
    
3. เขียน `c4-context.md` + `c4-container.md` — ใส่ mermaid code block + คำอธิบายสั้น ๆ
    - ตรวจ render บน GitHub (PR preview) ก่อน merge
    - ระบุ technology ของทุก container (เช่น “React”, “Node.js + Express”, “PostgreSQL”)
    - ระบุ label ของทุก edge (HTTPS, JSON, etc.)

### Step 4: ADR 0001 (30 นาที)

1. สร้าง `docs/architecture/adr/0001-monolith-vs-microservices.md` ตาม Michael Nygard format:
    
    ```markdown
    # ADR 0001: เริ่มต้นด้วย Monolith แล้วแยกทีหลัง
    
    ## Status
    Accepted — 2026-08-19
    
    ## Context
    -ทีม 4 คน, เวลา 8 สัปดาห์, scale ~100 users/day
    -ต้อง demo end-to-end ใน Sprint 2
    -ไม่มี ops engineer
    -Requirements ยังไม่แน่ชัด (early product)
    
    ## Decision
    เริ่มจาก Monolith ใช้ Node.js + Express แยกเป็น modules ภายใน
    หาก user เกิน 1,000 คน/วัน → ค่อย extract "matching service" แยก
    
    ## Consequences
    -✅ Deploy ง่าย (1 unit)
    -✅ ทีมเข้าใจเร็ว
    -✅ Performance ดีพอสำหรับ 100 users
    -❌ Scale ไม่ได้ทันที — ต้อง refactor
    -❌ Tech stack เดียว — ถ้าต้องการ Python สำหรับ ML ต้องทำผ่าน API
    
    ## Alternatives Considered
    -**Microservices (3 services)** — rejected: overhead สูง, ทีมไม่พร้อม
    -**Serverless (Lambda)** — rejected: cold start + cost สำหรับ low-traffic
    -**Separate Frontend + Backend (BFF)** — พิจารณา: ตัดสินทำทีหลัง
    ```
    

### Step 5: Wrap-up + PR (10 นาที)

1. ตรวจ PR ของตัวเองก่อนเปิด review: ไฟล์ครบ 5 อย่าง, Mermaid render ถูก, ADR มี 5 sections
2. ทีมตกลง: ใครจะอ่าน diagram ของทีมอื่น (cross-review)? จะได้ spot inconsistency
3. PR + Review + Merge (merge `reflect.md` จาก feature/exit-ticket-5 เข้ามาด้วย)

---

## 6. เกณฑ์การประเมิน (Rubric)

**ตาราง L5.1 — เกณฑ์การให้คะแนน Lab 5**

| ส่่งที่ส่ง | **Full 3.5%** | **Partial 1.75%** | **None 0%** |
| --- | --- | --- | --- |
| **tech_stack.md** | 5+ layer + rationale เชิง context + alternative ครบ | มีแต่ขาด rationale/alternative | ไม่มี |
| **C4 Context + Container** | Mermaid render ถูก + ครบ component + technology label | Mermaid error หรือขาด label | ไม่มี |
| **ADR 0001** | Status + Context + Decision + Consequences + Alternatives ครบ | ขาด 1–2 sections | ไม่มี |
| **PR workflow + reflect merge** | branch + PR + Review + Merge + screenshots + reflect.md | ขาด review หรือ reflect | push ตรง main |

> **หมายเหตุ**: คะแนนเป็น **Completion and Effort** — ต้องได้ครบทั้ง 4 ข้อถึงได้ 3.5% (ไม่หักคะแนนรายข้อย่อย) เพื่อกระตุ้นให้นิสิตทำครบ + แสดงให้เห็นว่าตั้งใจ
> 

---

## 7. นโยบายการใช้ Generative AI (AI Usage Guidance)

| ✅ อนุญาต | ❌ ไม่อนุญาต |
| --- | --- |
| ใช้ AI generate Mermaid syntax ที่ถูกต้อง (C4Context/C4Container) | **ห้าม** ให้ AI ตัดสิน tech stack — เป็น product/architecture decision ของทีม |
| ใช้ AI challenge ADR — “มี consequence อะไรที่ทีมคิดไม่ถึง?” | **ห้าม** generate diagram โดยไม่เข้าใจ — ทีมต้องอธิบายได้ทุก component |
| ใช้ AI ช่วยร่าง rationale แต่ต้องปรับให้เป็น context ของทีม | ห้าม copy ADR จากโปรเจกต์อื่นโดยไม่เข้าใจ |
| ใช้ AI อธิบาย trade-off ระหว่าง patterns | ห้ามใช้ AI เลือก Monolith vs Microservices แทนทีม |

**ต้องเปิดเผย** ใน `AI_USAGE.md`:
- เครื่องมือ: <Copilot/ChatGPT/Claude/etc.>
- Prompts ที่ใช้ (≥ 2 prompts — เช่น “generate C4 mermaid syntax สำหรับ Pomodoro app”, “challenge ADR ของทีมที่เลือก Monolith”)
- ส่วนที่รับจาก AI ตรง ๆ (ไม่แก้)

---

## 8. ข้อควรระวัง (Common Pitfalls)

> **❌ Tech stack เลือกเพราะ “เพื่อนใช้” หรือ “อาจารย์บอก”** — ไม่มี rationale ในบริบทของโปรเจกต์
> 

> **❌ Microservices เลือกเพราะ “เท่”** — ละเมิด Rule of Twos (ESP §6.3): Dev/test/deploy ≤ 2 สัปดาห์, Team ≤ 2 pizzas, Single responsibility, Stateless
> 

> **❌ Diagram มี box แต่ไม่มี label/legend** — คนอ่านไม่เข้าใจ
> 

> **❌ ADR เป็นแค่ “เลือก X เพราะดี”** — ต้องมี Consequences + Alternatives
> 

> **❌ ไม่ระบุ Status (Accepted/Proposed/Superseded)** — อนาคตอ่านไม่ออกว่าใช้อยู่ไหม
> 

> **❌ Mermaid syntax error** — render ไม่ได้ = เสียคะแนน
> 

> **❌ Container ไม่ระบุ technology** — ไม่รู้ว่า deploy อะไร
> 

> **❌ ไม่ merge reflect.md จาก Post-quiz 5** — ทำให้ขาด input สำคัญของ Lab
> 

---

## 9. ความท้าทายเพิ่มเติม (Stretch Goals)

สำหรับนิสิตที่ทำเสร็จก่อน — ลองทำเพิ่ม (ไม่บังคับ ไม่คิดคะแนนเพิ่ม):

- **C4 Component (Level 3)** — แสดง class/module ภายใน API (controllers, services, repositories)
- **Deployment diagram** — แสดงว่า deploy ที่ไหนอย่างไร (Docker, Render, CDN)
- **ADR ที่ 2** — เรื่อง database choice (relational vs NoSQL) หรือ auth strategy (JWT vs OAuth2)
- **Quality Attributes Workshop** — เขียน NFR table (performance, security, availability, scalability) พร้อม target + measurement
- **Cross-team review** — อ่าน ADR ของทีมอื่น + comment 1 ข้อเสนอแนะ

---

## 10. การส่งงาน

1. **Pull Request** ใน Team Repository — ต้อง merge สำเร็จ
2. **`docs/architecture/c4-context.md`** + **`docs/architecture/c4-container.md`** — Mermaid render ถูก
3. **`docs/architecture/tech_stack.md`** — 5+ layer + rationale + alternative
4. **`docs/architecture/adr/0001-*.md`** — 5 sections ครบ
5. **`AI_USAGE.md`** (root) — อัปเดต tools + prompts + ส่วนที่รับ AI
6. **`reflect.md`** (Post-quiz 5) — merge พร้อม Lab 5

> **Due**: สิ้นสุด Lab ภายใน 2 ชั่วโมง (ไม่รับงานที่ส่งหลังคาบออก นอกจากมีเหตุผลจำเป็น)
> 

---

## 11. เชื่อมโยงบทเรียน

แนวคิดที่ใช้ใน Lab 5 นี้จะถูกนำไปใช้ตลอดภาคการศึกษา:

- **5 คำถาม Trade-offs** → ใช้ตัดสินทุก architecture decision — ก่อนเลือก pattern ถาม 5 ข้อเสมอ
- **Layered + MVC** → ใช้เป็น default pattern สำหรับ product ขนาดเล็ก-กลาง
- **Multi-tier vs Service-oriented** → ใช้ตัดสินตามบริบท (ทีม/scale/ข้อมูล/deploy)
- **ADR** → ใช้บันทึกทุก decision ใหญ่ — institutional memory ที่ทีมใหม่อ่านได้
- **C4 Diagrams** → ใช้สื่อสาร architecture ระหว่างทีม + กับ stakeholder
- **Post-quiz** → ใช้ในทุกบทเพื่อเตรียม Sprint ถัดไป
- **AI_USAGE.md** → ใช้ในทุก Lab / Sprint — ต้องอัปเดต

---

## 12. บรรณานุกรมประจำ Lab

- Sommerville, I. (2019). *Engineering Software Products: An Introduction to Modern Software Engineering*. Pearson. Chapter 4.
- Sommerville, I. (2016). *Software Engineering* (10th ed.). Pearson. Chapter 6.
- Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
- Lewis, J., & Fowler, M. (2014). *Microservices*. martinfowler.com.
- Brown, S. (2011). *C4 Model*. c4model.com.
- Nygard, M. (2011). *Documenting Architecture Decisions*. thinkrelevance.com.
- เอกสารประกอบการสอน บทที่ 5 — สถาปัตยกรรมซอฟต์แวร์

---

*ใบงานนี้จัดทำโดย: ธรรมรัตน์ ธรรมา · สาขาวิทยาการคอมพิวเตอร์ คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา · ภาคเรียนที่ 1 ปีการศึกษา 2569*