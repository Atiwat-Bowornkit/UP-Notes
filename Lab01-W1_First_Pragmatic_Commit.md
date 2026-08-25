# Lab01-W1_First_Pragmatic_Commit
## ใบงานปฏิบัติการ Lab 1: First Pragmatic Commit

**รายวิชา:** แนวคิดวิศวกรรมซอฟต์แวร์ · **รหัสวิชา:** 225311  
**สัปดาห์ที่ 1** · **ภาคการศึกษา:** ภาคเรียนที่ 1 ปีการศึกษา 2569  
**เวลา:** 2 ชั่วโมง (ห้องปฏิบัติการ) · **คะแนน:** 1.75% ของคะแนนรวม  
**อาจารย์ผู้สอน:** อาจารย์ ธรรมรัตน์ ธรรมา · สาขาวิทยาการคอมพิวเตอร์ คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา  
**ส่งงานผ่าน:** GitHub Pull Request ในทีม repository บน GitHub Organization ของรายวิชา  

---

## 1. วัตถุประสงค์เชิงพฤติกรรม (Behavioral Objectives)
เมื่อทำ Lab นี้เสร็จ นิสิตสามารถ
- ตั้งค่าบัญชี GitHub และ Git client ในเครื่องตนเองให้พร้อมทำงานร่วมกับทีม
- สร้าง branch และทำ commit ที่สื่อความหมายด้วย conventional commit format
- เปิด Pull Request ที่ผ่าน code review จากเพื่อนร่วมทีม
- สะท้อนคิดผ่าน “Pragmatic Promise” ของตนเอง
- เสนอทางเลือกแทนข้อแก้ตัว เมื่อเจอปัญหาในการทำงาน

**สอดคล้องกับ Learning Outcomes:** LO1, LO8, LO9  
**อ้างอิงเนื้อหาบทเรียน:** บทที่ 1 — แนะนำรายวิชาและปรัชญาวิศวกรรมซอฟต์แวร์  

## 2. เนื้อหาที่ต้องอ่านก่อนทำ Lab (Pre-lab Reading)
กรุณาอ่านเนื้อหาก่อนเข้าห้องปฏิบัติการ (อ่านจาก slide deck ของบทที่ 1 หรือ PDF ตำรา):
- **[PP] Ch.1** — Tips 1–8 (โดยเฉพาะ Tip 1 It’s Your Life, Tip 4 Provide Options, Don’t Make Lame Excuses, Tip 5 Don’t Live with Broken Windows, Tip 8 Good-Enough Software)
- **[ESP] Ch.1 §1.1–1.2** — Project vs Product
- **เอกสารประกอบการสอนบทที่ 1** §1.2 (Project vs Product) และ §1.3 (ปรัชญา Pragmatic)

**คำถามนำก่อนทำ Lab (ให้คิดมาก่อนเข้าคาบ):**
- ทำไมเราถึงไม่ push ตรง main?
- Commit message ที่ดีควรมีลักษณะอย่างไร?

## 3. เครื่องมือและบัญชีที่ต้องเตรียม (Materials & Tools)

| รายการ | รายละเอียด |
| :--- | :--- |
| **GitHub Account** | บัญชีส่วนตัวหรือของมหาวิทยาลัย (ถ้ายังไม่มี สมัครที่ github.com) |
| **Git CLI** | ติดตั้งจาก git-scm.com (ตรวจสอบด้วย `git --version`) |
| **ตั้งค่า Git Identity** | `git config --global user.name "<name>"` และ `git config --global user.email "<email>"` |
| **Editor / IDE** | VS Code, PyCharm Community หรืออื่น ๆ — ติดตั้งส่วนขยาย Git หรือ built-in integration |
| **GitHub Organization** | รับคำเชิญเข้า GitHub Organization ของรายวิชา (ส่งทาง email) — ยอมรับ invite |
| **Team Repository** | หัวหน้าทีมจะสร้าง Team Repository และเพิ่มสมาชิกเข้าทีม (ในชั่วโมง Lab) |

## 4. สิ่งที่ต้องส่ง (Deliverables)
ส่งผ่าน GitHub Pull Request ใน repository ของทีม ภายในสิ้นสุด Lab (2 ชม.):

### 4.1 Pull Request
- **Branch:** `feature/lab1-intro-<your-name>`
- **ไฟล์ใหม่:** `team/<your-name>.md` (200–500 คำ) ประกอบด้วย 4 sections:

| Section | เนื้อหา |
| :--- | :--- |
| **Identification** | ชื่อ-นามสกุล, ชื่อเล่น, รหัสนิสิต, สาขา, ปีการศึกษา |
| **Pragmatic Promise** | 1–2 ประโยค — พฤติกรรมที่เป็นรูปธรรม (concrete) ที่ตัวเองจะทำต่างไปในรายวิชานี้ |
| **ทำไมอยากเรียน SE** | 2–3 ประโยค |
| **Broken Window ที่เคยเจอ** | 1 ประสบการณ์จริง — อธิบาย (1) window คืออะไร (2) ผลกระทบ (3) ถ้าแก้ทันทีจะป้องกันอะไร |

- **Commit message** ในรูปแบบ Conventional Commits (เช่น `docs(team): add intro for <your-name>`)
- **PR description** 2–3 บรรทัด — ทำอะไร + ทำไม
- **Tag reviewer** อย่างน้อย 1 คนในทีม (ใช้ `@mention`)
- ผ่าน review และ merge เข้า `main`

### 4.2 GitHub Project Board
- มี Issue/PR card ที่ column **Done** หลัง merge สำเร็จ

### 4.3 Team README.md (หัวหน้าทีมรับผิดชอบ)
- รายชื่อสมาชิกครบทุกคน
- Theme ของทีม (ตัวเลือกจากภาคผนวก ค: Project Themes)

## 5. ขั้นตอนการปฏิบัติ (Step-by-Step)
> **ก่อนเริ่ม Lab 1** — ตรวจสอบว่านิสิตได้ทำ Post-quiz จากคาบบรรยายแล้ว (จาก §1.7 ในบทเรียน)
> ถ้ายังไม่ได้ทำ → ให้ทำ Post-quiz 3 ข้อ (Vision Filter + Broken Window + Pragmatic Promise) ใน 15 นาทีแรกของ Lab
> Pragmatic Promise (Post-quiz B3) จะถูกคัดลอกไปใส่ใน `team/<your-name>.md` (Step 4 ด้านล่าง)

**Step 1: เข้า Organization และ Team**
- รับ email คำเชิญเข้า GitHub Organization ของรายวิชา
- คลิก Accept Invitation
- เข้า Team Repository ที่ได้รับสิทธิ์ (หัวหน้าทีมจะสร้างและเชิญสมาชิก)

**Step 2: Clone และตั้งค่า Git**
```bash
git clone <team-repo-url>
cd <team-repo-name>
git config user.name  "<Your Name>"
git config user.email "<your.email@example.com>"
git config --list --local  # verify
```

**Step 3: สร้าง Branch — ห้าม push ตรง main**
```bash
git checkout main
git pull origin main          # sync
git checkout -b feature/lab1-intro-<your-name>
```

**Step 4: สร้างไฟล์ตาม template**
- สร้างไฟล์ `team/<your-name>.md` ตามโครงสร้าง 4 sections ในข้อ 4.1

**Step 5: Commit ด้วย Conventional Commits**
```bash
git add team/<your-name>.md
git status                    # ตรวจสอบไฟล์ที่จะ commit
git commit -m "docs(team): add intro for <your-name> with pragmatic promise"
git push origin feature/lab1-intro-<your-name>
```

**Step 6: เปิด Pull Request**
- ไปที่ repository บน GitHub → Compare & pull request
- **Base:** `main` ← **Compare:** `feature/lab1-intro-<your-name>`
- **Title:** `Lab 1: <Your Name> — First Pragmatic Commit`
- **Description 2–3 บรรทัด:**
    ```markdown
    - เพิ่มไฟล์ team/<your-name>.md พร้อม 4 sections
    - Pragmatic Promise: <คัดลอก 1 ประโยค>
    - @<reviewer> รบกวน review ครับ
    ```
- กด **Create pull request**

**Step 7: Code Review**
- Reviewer ตรวจสอบ: ไฟล์ครบ, content เหมาะสม, commit/PR conventions ถูก
- ถ้ามี comment → แก้ → commit เพิ่มใน branch เดิม → re-tag reviewer
- เมื่อผ่านครบ → กด **Merge pull request** → Confirm

**Step 8: Update Project Board**
- ย้าย card ของตัวเองจาก **In Progress → Done**

## 6. เกณฑ์การประเมิน (Rubric)
**ตาราง L1.1 — เกณฑ์การให้คะแนน Lab 1**

| สิ่งที่ส่ง | Full 1.75% | Partial 0.875% | None 0% |
| :--- | :--- | :--- | :--- |
| **ไฟล์ `team/<your-name>.md`** | ครบ 4 sections, ภาษาดี, ≥ 200 คำ, “Pragmatic Promise” เป็นพฤติกรรมวัดผลได้ | ขาด 1 section หรือ < 200 คำ หรือ Promise คลุมเครือ | ไม่มีไฟล์ / push ตรง main |
| **Commit + PR workflow** | branch + commit message ตาม convention + PR + tag reviewer + review pass + merge | มี commit แต่ขาด review/merge หรือ message อ่อน | push ตรง main / ไม่มี PR |
| **Project Board update** | Card อยู่ Done column ภายในสิ้นสุด Lab | มี card แต่ column ผิด | ไม่อัปเดต |

> **หมายเหตุ:** คะแนนเป็น Completion and Effort — เน้นทำครบตามโจทย์ + แสดงให้เห็นว่าตั้งใจ ไม่หักคะแนนรายข้อย่อย เพื่อกระตุ้นให้นิสิตกล้าลอง

## 7. นโยบายการใช้ Generative AI (AI Usage Guidance)

| ✅ อนุญาต | ❌ ไม่อนุญาต |
| :--- | :--- |
| ใช้ AI ช่วย polish ภาษาไทย/อังกฤษ | ให้ AI เขียน “Pragmatic Promise” แทน (ต้องมาจากตัวเอง) |
| ใช้ AI brainstorm คำถามสำหรับ Broken Window ที่เคยเจอ | Copy-paste ผลงานเพื่อน (ต้องเป็นประสบการณ์จริง) |
| ใช้ AI อธิบาย Git/GitHub command ที่ไม่เข้าใจ | วางข้อมูลส่วนตัวของผู้อื่น (เช่น รหัสนิสิตเพื่อน) ใน AI chat |

> **หมายเหตุ:** หากมีการใช้งาน AI **ต้องเปิดเผย** โดยระบุใน commit message หรือ PR description ว่าใช้ AI ช่วยอะไร (ดู template `AI_USAGE.md` ในภาคผนวก ง)

## 8. ข้อควรระวัง (Common Pitfalls)
- ❌ **Push ตรง main**
  - โดนหักคะแนน / ต้อง revert + ทำใหม่ — ใช้ branch เสมอ
- ❌ **Commit message ว่างเปล่า (เช่น “update”, “fix”)**
  - ไม่บอกอะไรกับทีม — ใช้ Conventional Commits เช่น `docs(team): ...`, `feat: ...`, `fix: ...`
- ❌ **PR ไม่มี description**
  - Reviewer ไม่รู้จะดูอะไร — เขียน 2–3 บรรทัดว่าทำอะไร + ทำไม
- ❌ **ไม่ tag reviewer**
  - ใช้ GitHub `@mention` ใน PR description (เช่น `@somchai`)
- ❌ **“Pragmatic Promise” เขียนว่างเปล่า (เช่น “จะตั้งใจเรียน”)**
  - ไม่เป็นรูปธรรมและวัดผลไม่ได้ (not concretely actionable) — ต้องระบุพฤติกรรมที่วัดได้ เช่น “จะไม่ใช้ข้อแก้ตัว — เมื่อทำพลาดจะเสนอทางเลือกแทน”
- ❌ **Push ข้อมูลส่วนตัวของผู้อื่น**
  - ไม่ commit ข้อมูลจริงของเพื่อน (ชื่อ + รหัสนิสิต) เข้า repository — ใช้ตัวอย่างหรือ mock data

## 9. ความท้าทายเพิ่มเติม (Stretch Goals)
สำหรับนิสิตที่ทำเสร็จก่อน — ลองทำเพิ่ม (ไม่บังคับ ไม่คิดคะแนนเพิ่ม):
- **Section 5 Things I Want to Learn** — เพิ่มใน `<your-name>.md` 5 ทักษะ/ความรู้ที่อยากได้จากรายวิชานี้
- **GitHub Profile** — ตั้ง avatar, bio ให้ดูเป็นมืออาชีพ
- **Pinned Repos** — pin repo ที่ทำในรายวิชาให้เห็นบนหน้า profile
- **GPG Signed Commits** — สร้าง GPG key + signed commits (อ้างอิง [PP] Tip 28 + security mindset ของบทที่ 11)

## 10. การส่งงาน
- **Pull Request** ใน Team Repository — ต้อง merge สำเร็จ
- **Card บน Project Board** — ย้ายมาที่ Done
- **AI_USAGE.md** (ถ้ามีการใช้ AI) — ใน root ของ repository
- **Due:** สิ้นสุด Lab ภายใน 2 ชั่วโมง (ไม่รับงานที่ส่งหลังคาบออก นอกจากมีเหตุผลจำเป็น)

## 11. เชื่อมโยงบทเรียน
แนวคิดที่ใช้ใน Lab 1 นี้จะถูกนำไปใช้ตลอดภาคการศึกษา:
- **Tip 5: Don’t Live with Broken Windows** → เริ่มต้น clean repo ตั้งแต่ commit แรก
- **Git Workflow** → ขยายไปสู่ CI/CD (บทที่ 10) และ Code Review (บทที่ 13 Workshop)
- **PR + Review** → ทักษะหลักในการทำงานเป็นทีมทั้งภาคการศึกษา
- **Project Board** → ใช้ในการบริหาร Sprint ในบทที่ 2 (Agile)

## 12. บรรณานุกรมประจำ Lab
- Hunt, A., & Thomas, D. (2019). *The Pragmatic Programmer: Your Journey to Mastery* (2nd ed.). Addison-Wesley. Chapter 1.
- Sommerville, I. (2019). *Engineering Software Products*. Pearson. Chapter 1.
- Chacon, S., & Straub, B. (2014). *Pro Git* (2nd ed.). Apress. Chapters 2–3.
- Conventional Commits Specification (2024). *conventionalcommits.org*.
- GitHub Docs. (2024). *Pull Requests*. docs.github.com.
- เอกสารประกอบการสอน บทที่ 1 — แนะนำรายวิชาและปรัชญาวิศวกรรมซอฟต์แวร์

---
*ใบงานนี้จัดทำโดย: อาจารย์ ธรรมรัตน์ ธรรมา · สาขาวิทยาการคอมพิวเตอร์ คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา · ภาคเรียนที่ 1 ปีการศึกษา 2569*
