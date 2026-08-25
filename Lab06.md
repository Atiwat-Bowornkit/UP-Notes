# Lab06-W6_First_Container

# ใบงานปฏิบัติการ Lab 6

# First Container — Dockerfile + Build + Push

> **รายวิชา**: แนวคิดวิศวกรรมซอฟต์แวร์ · **รหัสวิชา**: 225311
**สัปดาห์ที่ 6 · ภาคเรียนที่ 1 ปีการศึกษา 2569เวลา**: 2 ชั่วโมง (ห้องปฏิบัติการ) · **คะแนน**: 3.5% ของคะแนนรวม
**อาจารย์ผู้สอน**: ธรรมรัตน์ ธรรมา · สาขาวิทยาการคอมพิวเตอร์ คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา
**ส่งงานผ่าน**: GitHub Pull Request ใน team repository (Dockerfile ใน root + docker/README.md) + reflect.md จาก Post-quiz 6
> 

---

## 1. วัตถุประสงค์เชิงพฤติกรรม (Behavioral Objectives)

เมื่อทำ Lab นี้เสร็จ นิสิตสามารถ

1. **เขียน** Dockerfile ที่ถูกต้องตามแนวปฏิบัติ (multi-stage, alpine/slim base, USER non-root, EXPOSE)
2. **สร้าง** `.dockerignore` ที่ exclude ไฟล์ที่ไม่จำเป็น (node_modules, .env, .git, IDE files)
3. **Build** Docker image จาก Dockerfile และ **run** container ที่ตอบ response 2xx
4. **Push** image ขึ้น registry (Docker Hub หรือ ghcr.io) พร้อม tag ที่ระบุเวอร์ชัน
5. **อธิบาย** trade-off ระหว่าง Container กับ VM ในบริบทของโปรเจกต์
6. **เปิดเผย** การใช้ AI ใน `AI_USAGE.md` (Dockerfile generation + best practices)

**สอดคล้องกับ Learning Outcomes**: LO2, LO6

**อ้างอิงเนื้อหาบทเรียน**: บทที่ 6 — สถาปัตยกรรมบนคลาวด์และไมโครเซอร์วิส

---

## 2. เนื้อหาที่ต้องอ่านก่อนทำ Lab (Pre-lab Reading)

กรุณาอ่านเนื้อหาก่อนเข้าห้องปฏิบัติการ (อ่านจาก slide deck ของบทที่ 6 หรือ PDF ตำรา):

- **[ESP] Ch.5** — Cloud Service Models · Container vs VM · Cloud as Default
- **[ESP] Ch.6** — Microservices Rule of Twos · REST API · Container deployment
- **[SE] Ch.17** — Distributed systems
- **[Docker docs]** — Dockerfile best practices + multi-stage builds
- **ทีมของคุณ’s Service** — source code ที่ build ได้จริง (API หรือ web app)

**คำถามนำก่อนทำ Lab** (ให้คิดมาก่อนเข้าคาบ):
- *ทีมจะ containerize **อะไร** (API? Web app? Worker?) — เพราะเหตุผลอะไร?*
- *Base image ไหนเหมาะกับ stack ของทีม (alpine/slim/distroless)?*

---

## 3. เครื่องมือและบัญชีที่ต้องเตรียม (Materials & Tools)

| รายการ | รายละเอียด |
| --- | --- |
| **GitHub Account** | บัญชีส่วนตัว (ใช้ account เดียวกับ Lab 1–5) |
| **Team Repository** | ต้อง push Dockerfile + docker/README.md ได้ |
| **Docker** | Docker Desktop (ติดตั้งแล้ว) หรือ Colima (Mac/Linux) หรือ GitHub Codespaces |
| **Container Registry** | Docker Hub (ฟรี) หรือ **ghcr.io** (แนะนำ — ผูกกับ GitHub org) |
| **Source Code** | จาก Sprint 2 — service ที่ build ได้จริง (มี Dockerfile-ready project) |
| **Post-quiz 6** | `reflect.md` จากคาบบรรยาย (Dockerfile draft + Service decomposition + REST endpoint) |

---

## 4. สิ่งที่ต้องส่ง (Deliverables)

ส่งผ่าน **GitHub Pull Request** ใน repository ของทีม ภายในสิ้นสุด Lab (2 ชม.):

### 4.1 ไฟล์ที่ต้องมี

| ไฟล์ | เนื้อหา | เกณฑ์ |
| --- | --- | --- |
| `Dockerfile` (root) | Multi-stage + alpine/slim base + USER non-root + EXPOSE | Build ผ่าน · image size สมเหตุสมผล |
| `.dockerignore` (root) | exclude node_modules, .env, .git, IDE files, tests | ≥ 5 รายการ |
| `docker/README.md` | คำอธิบาย image · build · run · trade-off | ครบ + อ้าง ESP §5.4 |
| **Image บน Registry** | Push ขึ้น Docker Hub หรือ ghcr.io พร้อม tag | tag ชัด (เช่น `v0.1.0`) + public |
| `AI_USAGE.md` (root) | อัปเดต: tools + prompts + ส่วนที่รับจาก AI | ครบทั้ง 3 sections |
| `reflect.md` (root) | Post-quiz 6 (merge จาก feature branch) | 3 reflection (Dockerfile + Service + REST) |

### 4.2 PR Workflow

- Branch: `feature/lab6-dockerfile`
- ต้อง merge `reflect.md` (Post-quiz 6) เข้ามาพร้อม
- ต้องมี **screenshot หน้า Docker Hub / ghcr.io** ใน PR description
- ผ่าน review + merge เข้า main

---

## 5. ขั้นตอนการปฏิบัติ (Step-by-Step)

> **ก่อนเริ่ม Lab 6** — ตรวจสอบว่านิสิตได้ทำ Post-quiz จากคาบบรรยายแล้ว (จาก §6.7 ในบทเรียน)
- ถ้ายังไม่ได้ทำ → ให้ทำ Post-quiz 3 ข้อ (Dockerfile draft + Service decomposition + REST endpoint) ใน 15 นาทีแรกของ Lab
- **Dockerfile draft (B1)** จะถูก refine เป็น production Dockerfile ใน Lab 6 — **Service decomposition (B2)** จะถูก verify ด้วย Rule of Twos
> 

### Step 1: ทบทวน + เลือก Service (15 นาที)

1. ทบทวน source code ของทีม — ระบุ service ที่จะ containerize:
    - **API server** (แนะนำ — stateless, เริ่มง่าย)
    - **Web app** (ถ้ามี separate frontend repo)
    - **Worker** (ถ้ามี background job)
2. ตรวจสอบว่า service **build ได้จริง** ใน local (npm/pip install สำเร็จ)
3. ระบุ dependencies หลัก + runtime version + port ที่ใช้

### Step 2: เขียน Dockerfile (50 นาที)

1. Branch `feature/lab6-dockerfile`
2. สร้าง `.dockerignore` ก่อน (ลด image size):
    
    ```
    node_modules
    .env
    .env.*
    .git
    .DS_Store
    __pycache__
    *.log
    tests/
    coverage/
    .vscode/
    .idea/
    *.md
    ```
    
3. เขียน `Dockerfile` — ใช้ **multi-stage build** ถ้าเป็น compiled language:
    
    **สำหรับ Node.js**:
    
    ```docker
    # Stage 1: deps
    FROM node:20-alpine AS deps
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci --only=production
    
    # Stage 2: runtime
    FROM node:20-alpine
    WORKDIR /app
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    EXPOSE 3000
    USER node
    CMD ["node", "server.js"]
    ```
    
    **สำหรับ Python (FastAPI)**:
    
    ```docker
    FROM python:3.12-slim
    WORKDIR /app
    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt
    COPY . .
    EXPOSE 8000
    USER nobody
    CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
    ```
    
4. **สำคัญ**:
    - ใช้ **alpine/slim base image** (image เล็ก < 200 MB สำหรับ alpine)
    - ใช้ `USER` แทน root (security — ESP §7)
    - `EXPOSE` port ที่ใช้จริง
    - ไม่ copy `.env` (ใช้ environment variable ตอน `docker run -e`)
    - Pin version ของ base image (ไม่ใช้ `:latest`)

### Step 3: Build + Test Local (30 นาที)

1. Build image:
    
    ```bash
    docker build -t <dockerhub-username>/<repo>-api:v0.1.0 .
    ```
    
2. รัน local + ทดสอบ:
    
    ```bash
    docker run -p 3000:3000 -e DATABASE_URL=... <dockerhub-username>/<repo>-api:v0.1.0
    ```
    
3. ทดสอบ endpoint จริง (curl, Postman, browser) — ต้อง response **2xx**
4. ตรวจ image size: `docker images` — ถ้า > 500 MB ถาม “ทำไมใหญ่?” (น่าจะลืม `.dockerignore` หรือใช้ base ใหญ่)
5. (Optional) ตรวจ security: `docker scan <image>` หรือใช้ Trivy

### Step 4: Push + Document (25 นาที)

1. Login registry:
    - **Docker Hub**: `docker login`
    - **ghcr.io** (แนะนำ): `echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin`
2. Push:
`bash docker push <dockerhub-username>/<repo>-api:v0.1.0 # หรือ docker push ghcr.io/<org>/<repo>-api:v0.1.0`
3. เขียน `docker/README.md`:
    - ชื่อ image + tag
    - Base image + size (จาก `docker images`)
    - วิธี build
    - วิธี run + env vars ที่ต้องการ
    - **ทำไมเลือก Container** (อ้าง ESP §5.4)
    - **ทำไมไม่ใช้ VM** (ตรงข้าม)
4. PR + Review + Merge + screenshot registry page ใน description

### Step 5: Wrap-up (10 นาที)

1. ทีมตกลง: ใครจะ containerize service ถัดไป (Worker? Database? Frontend?)
2. ตั้งเป้า Sprint หน้า: CI/CD build image ทุก PR (Lab 10 จะขยาย)

---

## 6. เกณฑ์การประเมิน (Rubric)

**ตาราง L6.1 — เกณฑ์การให้คะแนน Lab 6**

| สิ่งที่ส่ง | **Full 3.5%** | **Partial 1.75%** | **None 0%** |
| --- | --- | --- | --- |
| **Dockerfile ถูกต้อง** | multi-stage + alpine/slim + USER non-root + EXPOSE + pin version | build ได้แต่ขาด best practice | build ไม่ผ่าน |
| **Image build + run ได้** | `docker run` ตอบ 2xx + image < 500 MB | build ได้แต่ run ไม่ได้ หรือใหญ่เกิน | ไม่ build |
| **Image บน Registry** | tag ชัด + public + screenshot ใน PR | local เท่านั้น | ไม่ push |
| **docker/README.md + reflect + AI_USAGE** | ครบ + อ้าง ESP §5.4 + reflect.md merge | ขาด 1 อย่าง | ไม่มี |

> **หมายเหตุ**: คะแนนเป็น **Completion and Effort** — ต้องได้ครบทั้ง 4 ข้อถึงได้ 3.5% (ไม่หักคะแนนรายข้อย่อย)
> 

---

## 7. นโยบายการใช้ Generative AI (AI Usage Guidance)

| ✅ อนุญาต | ❌ ไม่อนุญาต |
| --- | --- |
| ใช้ AI generate Dockerfile (จากภาษา + framework) | **ห้าม** push image ที่มี secret — `.env` ใน image = leak (Lab 11 จะลงโทษ) |
| ใช้ AI อธิบาย layer แต่ละบรรทัดของ Dockerfile | **ห้าม** commit `.dockerignore` ที่ exclude ไฟล์จำเป็น (เช่น `package.json`) |
| ใช้ AI suggest base image ที่เหมาะ (alpine vs slim vs distroless) | **ห้าม** ใช้ AI เขียน healthcheck โดยไม่ทดสอบเอง |
| ใช้ AI challenge multi-stage strategy ของทีม | ห้ามใช้ image tag `:latest` ใน production |

**ต้องเปิดเผย** ใน `AI_USAGE.md`:
- เครื่องมือ: <Copilot/ChatGPT/Claude/etc.>
- Prompts ที่ใช้ (≥ 2 prompts — เช่น “เขียน Dockerfile multi-stage สำหรับ Node.js Express”, “อธิบายแต่ละ layer”)
- ส่วนที่รับจาก AI ตรง ๆ (ไม่แก้)

---

## 8. ข้อควรระวัง (Common Pitfalls)

> **❌ Image ใหญ่ (> 1GB)** — ไม่มี `.dockerignore` หรือใช้ base image ใหญ่เกิน (เช่น `node:latest`)
> 

> **❌ รันด้วย root** — security issue (ESP §7) — ต้อง `USER node` หรือ `USER nobody`
> 

> **❌ `.env` ใน image** — secret leak — ใช้ `-e DATABASE_URL=...` ตอน `docker run` หรือ Docker secrets
> 

> **❌ `EXPOSE` port ไม่ตรง** — `docker run -p 3000:8080` แต่ container ฟัง 8080 → ไม่ connect ได้
> 

> **❌ ไม่ pin version** — `FROM node:latest` → build วันนี้กับพรุ่งนี้ต่างกัน — ใช้ `node:20-alpine`
> 

> **❌ ไม่ทดสอบจริง** — push ขึ้นไปแล้ว pull มา run ไม่ได้ — ทดสอบ `docker run` ในเครื่องก่อน push
> 

> **❌ ไม่ merge reflect.md** — ทำให้ขาด Post-quiz input ของ Lab
> 

> **❌ COPY . . ทั้งหมด** — copy ทั้ง `node_modules`, `.git` เข้า image — ใช้ `.dockerignore`
> 

---

## 9. ความท้าทายเพิ่มเติม (Stretch Goals)

สำหรับนิสิตที่ทำเสร็จก่อน — ลองทำเพิ่ม (ไม่บังคับ ไม่คิดคะแนนเพิ่ม):

- **HEALTHCHECK** — เพิ่ม `HEALTHCHECK CMD curl -f http://localhost:3000/health` ใน Dockerfile
- **GitHub Actions** — ตั้ง workflow build image ทุก PR (preview ก่อน Lab 10)
- **`docker-compose.yml`** — สำหรับ multi-container (API + DB + cache)
- **Multi-arch build** — `docker buildx build --platform linux/amd64,linux/arm64`
- **Non-root user ขั้นสูง** — สร้าง dedicated user แทนใช้ `USER node` (เช่น `appuser`)
- **Distroless base** — `gcr.io/distroless/nodejs` — image เล็กมาก < 100 MB, security สูง

---

## 10. การส่งงาน

1. **Pull Request** ใน Team Repository — ต้อง merge สำเร็จ
2. **`Dockerfile`** (root) — multi-stage + alpine/slim + USER non-root + EXPOSE
3. **`.dockerignore`** (root) — ≥ 5 รายการ
4. **`docker/README.md`** — ครบ + อ้าง ESP §5.4
5. **Image บน Docker Hub หรือ ghcr.io** — tag ชัด + public + screenshot ใน PR
6. **`AI_USAGE.md`** (root) — อัปเดต
7. **`reflect.md`** (Post-quiz 6) — merge พร้อม Lab 6

> **Due**: สิ้นสุด Lab ภายใน 2 ชั่วโมง (ไม่รับงานที่ส่งหลังคาบออก นอกจากมีเหตุผลจำเป็น)
> 

---

## 11. เชื่อมโยงบทเรียน

แนวคิดที่ใช้ใน Lab 6 นี้จะถูกนำไปใช้ตลอดภาคการศึกษา:

- **Container vs VM** → ใช้ตัดสิน deploy target — Container เป็น default สำหรับ stateless service
- **Microservices Rule of Twos** → ใช้ตรวจ service ที่จะแยก container
- **Cloud Service Models** → Container deploy บน PaaS (Render · Fly.io · Railway) หรือ IaaS (EC2)
- **REST API** → containerized API รับ traffic ผ่าน API Gateway (จะเรียนในบทถัดไป)
- **Dockerfile best practices** → USER non-root → ลด attack surface ใน production
- **Post-quiz** → ใช้ในทุกบทเพื่อเตรียม Sprint ถัดไป
- **AI_USAGE.md** → ใช้ในทุก Lab / Sprint — ต้องอัปเดต

---

## 12. บรรณานุกรมประจำ Lab

- Sommerville, I. (2019). *Engineering Software Products: An Introduction to Modern Software Engineering*. Pearson. Chapters 5–6.
- Sommerville, I. (2016). *Software Engineering* (10th ed.). Pearson. Chapters 17–18.
- Lewis, J., & Fowler, M. (2014). *Microservices*. martinfowler.com.
- Merkel, D. (2014). *Docker: Lightweight Linux Containers for Consistent Development and Deployment*. linuxjournal.com.
- Docker Inc. (2024). *Docker Documentation — Dockerfile Reference*. docs.docker.com.
- NIST (2011). *The NIST Definition of Cloud Computing*. SP 800-145.
- เอกสารประกอบการสอน บทที่ 6 — สถาปัตยกรรมบนคลาวด์และไมโครเซอร์วิส

---

*ใบงานนี้จัดทำโดย: ธรรมรัตน์ ธรรมา · สาขาวิทยาการคอมพิวเตอร์ คณะเทคโนโลยีสารสนเทศและการสื่อสาร มหาวิทยาลัยพะเยา · ภาคเรียนที่ 1 ปีการศึกษา 2569*