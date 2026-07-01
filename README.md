# Project: [UP-Notes]
_A brief, one-sentence description of what your project does._

## Team: [CS-Sheet-67]
- [นาย อธิวัฒน์ บวรกิจ], GitHub: `[@Atiwat-Bowornkit]`
- [นาย ถิรวัฒน์ วงค์ทอง], GitHub: `[@Thararee]`
- [นาย นนทกร สิงห์ทอน], GitHub: `[@nonthakorn2006]`
- [นาวสาว ธนวรรณ สมแก้ว], GitHub: `[@Tanawan28]`

---

## 🚀 Getting Started

This section explains how to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

- Git
- Python 3.10+
- Docker & Docker Compose

### Running the Application (with Docker)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Software-Engineering-Concepts-2026/se-sec1-team-06.git
    cd se-sec1-team-06
    git checkout -b ประเภทงาน/เนื้อหางานที่ทำ

    Update Branch
    git add .
    git commit -m "ข้อความอธิบายการเปลี่ยนแปลง"
    git push -u origin branch-name

    Update Main
    ไป Pull Request
    คลิก Files changed
    คลิก Review changed
    เลือก Approve แล้วกด Submit
    ```

2.  **Run the services:**
    *(This section will be updated in later weeks when using Docker Compose)*
    ```bash
    # Example for a single service
    cd services/stats-service
    docker build -t your-team/stats-service .
    docker run -p 5001:5000 your-team/stats-service
    ```

---

## 🏛️ Architecture & Design

Key architectural decisions and diagrams are documented in the `/docs/architecture` directory.

- **[C4 Models & Tech Stack](./docs/architecture/README.md)**
- **[Architectural Decision Records (ADRs)](./docs/architecture/adr/)**

## 👥 Requirements

User personas and key scenarios that drive our development are located in the `/docs/requirements` directory.

- **[Requirements Overview](./docs/requirements/README.md)**
- **[User Personas](./docs/requirements/personas/README.md)**
- **[Main User Scenario](./docs/requirements/main_scenario.md)**


#UP-Summary: Team Working Agreements

เอกสารฉบับนี้คือ "ข้อตกลงในการทำงานร่วมกัน" ของทีมพัฒนา UP-Summary เพื่อให้การสื่อสารราบรื่น โค้ดมีคุณภาพ และทุกคนสามารถทำงานร่วมกันได้อย่างมีประสิทธิภาพ

#1.ความถี่ในการประชุม (Meeting Rhythms)
เนื่องจากสมาชิกในทีมมีตารางเรียน เราจะเน้นการประชุมที่กระชับและใช้เวลาให้เกิดประสิทธิภาพสูงสุด:
*   **Sprint Planning (วางแผนรอบการทำงาน):** 
    *   **ความถี่:** ทุกๆ 1 สัปดาห์ (ช่วงสุดสัปดาห์ หรือวันที่ทุกคนว่างกัน)
    *   **ระยะเวลา:** 30 - 60 นาที
    *   **เป้าหมาย:** เลือกงานจาก Backlog ที่จะทำใน Sprint นี้และแบ่งงานให้ชัดเจน
*   **Daily Sync (อัปเดตงานประจำวัน):** 
    *   **ความถี่:** ทุกวันที่เจอกัน (แบบ Asynchronous)
    *   **รูปแบบ:** พิมพ์อัปเดตสั้นๆ ในช่องแชทหลักของทีม โดยตอบ 3 คำถาม: *เมื่อวานทำอะไร? วันนี้จะทำอะไร? ติดปัญหาอะไรไหม?*
*   **Sprint Review & Retrospective (ตรวจรับงานและประเมินผล):**
    *   **ความถี่:** ทุกสิ้นสุด Sprint (สามารถทำติดกับ Sprint Planning ของรอบถัดไปได้เลย)
    *   **ระยะเวลา:** 30 - 45 นาที
    *   **เป้าหมาย:** โชว์ผลงาน (เช่น โชว์หน้าเว็บ Next.js ที่อัปเดตใหม่) และพูดคุยว่าอะไรทำได้ดี อะไรควรปรับปรุงใน Sprint หน้า

## 2.กฎการสื่อสาร (Communication Rules)
เพื่อไม่ให้ข้อมูลสำคัญตกหล่นหรือกระจัดกระจาย:

*   **Public Over Private:** การพูดคุยเรื่องโปรเจกต์ การตัดสินใจ หรือการสอบถามปัญหาทางเทคนิค ให้พิมพ์ใน **"ช่องทางสาธารณะของทีม"** เสมอ เพื่อให้ทุกคนเห็นบริบทตรงกัน (หลีกเลี่ยงการ Direct Message หรือ DM เว้นแต่เป็นเรื่องส่วนตัวจริงๆ)
*   **เวลาในการตอบกลับ (SLA):** เราเข้าใจว่าทุกคนมีเรียน ดังนั้นเราคาดหวังให้สมาชิกตอบกลับข้อความหรือแท็กสำคัญภายใน **12-24 ชั่วโมง**
*   **การแท็ก (Mentions):** ใช้ `@ชื่อ` เมื่อต้องการให้เพื่อนคนนั้น อ่านหรือตรวจสอบด่วน และใช้  `@everyone` เฉพาะเรื่องฉุกเฉินระดับโปรเจกต์เท่านั้น

## 3.เวิร์กโฟลว์ Git (Git & Code Workflow)
เราจะใช้กระบวนการที่เรียบง่ายแต่ป้องกันไม่ให้โค้ดพังเมื่อนำไปรวมกัน (GitHub Flow):

*   **Branching Naming Convention:** 
    *   ห้าม Push โค้ดตรงเข้า `main` เด็ดขาด
    *   สร้าง Branch ใหม่จาก `main` เสมอ โดยใช้รูปแบบ: `ประเภท/ชื่องาน`
    *   *ตัวอย่าง:* `feat/upload-pdf`, `fix/login-button`, `docs/update-readme`
*   **Commit Messages:** เขียนให้รู้ว่าทำอะไรไปบ้าง (Conventional Commits)
    *   *ตัวอย่าง:* `feat: add Tailwind styling to subject cards` หรือ `fix: resolve PostgreSQL connection issue`
*   **Pull Requests (PR) & Code Reviews:**
    *   เมื่อทำงานเสร็จ ให้เปิด PR กลับมาที่ `main` พร้อมเขียนอธิบายสั้นๆ ว่า PR นี้แก้ปัญหาอะไร
    *   **กฎเหล็ก:** ต้องมีสมาชิกในทีม **อย่างน้อย 1 คน** เข้ามาอ่านโค้ดและกด **Approve** ก่อน จึงจะสามารถ Merge โค้ดเข้า `main` ได้

## 4. ⚖️ การตัดสินใจ (Decision Making)
เมื่อมีความคิดเห็นไม่ตรงกันเรื่องสถาปัตยกรรมระบบหรือแนวทางการออกแบบ:

*   **หลีกเลี่ยงการเถียงกันลอยๆ:** หากถกเถียงกันเกิน 15 นาที ให้หยุดพักและใช้เวลาทำ **Timeboxed Spike** (ใช้เวลา 1-2 ชั่วโมงลองเขียนโค้ดต้นแบบ หรือหาข้อมูลเปรียบเทียบข้อดีข้อเสียจริงๆ มาคุยกัน)
*   **ฉันทามติและการโหวต (Consensus & Voting):** เมื่อข้อมูลพร้อม ให้ทีมโหวตเพื่อหาทางออกร่วมกัน
*   **Tie-breaker (ผู้ชี้ขาด):** หากเสียงแตกและตกลงกันไม่ได้ ให้สิทธิ์การตัดสินใจขั้นเด็ดขาดแก่ **ผู้นำรับผิดชอบในส่วนนั้น** (เช่น หากเป็นปัญหาเรื่อง UI ให้คนที่เป็น Lead Frontend ตัดสินใจ, หากเป็นเรื่อง Database ให้ Lead Backend เป็นคนเคาะ) เพื่อให้โปรเจกต์เดินหน้าต่อได้