# 🐳 Docker Container Specification & Deployment Guide — UP-Notes

เอกสารอธิบายการทำคอนเทนเนอร์ (Containerization) โครงสร้าง Dockerfile คำสั่ง Build/Run และการวิเคราะห์ทางเลือกทางสถาปัตยกรรม (Container vs VM) สำหรับแพลตฟอร์ม **UP-Notes**

---

## 1. ข้อมูล Container Image & Registry Details

* **Registry Target:** GitHub Container Registry (`ghcr.io`) / Docker Hub
* **Image Name:** `ghcr.io/software-engineering-concepts-2026/se-sec1-team-06-api`
* **Version Tag:** `v0.1.0` (Semantic Versioning)
* **Base Image:** `node:20-alpine`
* **Estimated Image Size:** **~125 MB** (ปรับแต่งด้วย Multi-stage Build และ `.dockerignore`)
* **Exposed Port:** `3000`
* **Non-Root User:** `nextjs` (UID/GID: 1001)

---

## 2. ขั้นตอนการ Build และสั่งรัน Container (Build & Run Instructions)

### 🔨 2.1 คำสั่งการ Build Image
```bash
# สั่ง Build Image พร้อมกำหนด Tag เวอร์ชัน v0.1.0
docker build -t ghcr.io/software-engineering-concepts-2026/se-sec1-team-06-api:v0.1.0 .

# ตรวจสอบขนาดของ Image หลัง Build สำเร็จ
docker images | grep se-sec1-team-06-api
```

### 🚀 2.2 คำสั่งการสั่งรัน Container (Local Run)
```bash
# สั่งรัน Container แบบ Detached Mode พร้อม Mapping Port 3000 และส่งผ่าน Environment Variables
docker run -d \
  --name up-notes-api \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://user:password@localhost:5432/upnotes" \
  ghcr.io/software-engineering-concepts-2026/se-sec1-team-06-api:v0.1.0

# ตรวจสอบสถานะการทำงานและ Logs ของ Container
docker ps
docker logs -f up-notes-api
```

### 📤 2.3 คำสั่งการ Push ขึ้น Registry
```bash
# ล็อกอินเข้าสู่ GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Push Image ขึ้นสู่ Registry
docker push ghcr.io/software-engineering-concepts-2026/se-sec1-team-06-api:v0.1.0
```

---

## 3. วิเคราะห์ทางเลือก: ทำไมต้องเป็น Container vs. Virtual Machine (VM)?

อ้างอิงจากบทเรียน **[ESP] §5.4 (Cloud Infrastructure & Virtualization)**:

### 3.1 เหตุผลในการเลือกใช้ Containerization สำหรับ UP-Notes
1. **Consistency Across Environments (ความสม่ำเสมอของสภาพแวดล้อม):** แก้ปัญหา "Works on my machine" โดยทำให้สภาพแวดล้อมตั้งแต่เครื่องโน้ตบุ๊กของนิสิต สภาพแวดล้อมการทดสอบ (Staging) และระบบการผลิต (Production) เหมือนกัน 100%
2. **Speed & Resource Efficiency (ความเร็วและประหยัดทรัพยากร):** Container ใช้การแชร์ OS Kernel ร่วมกับ Host ทำให้เริ่มต้นทำงาน (Startup Time) ได้ภายใน **2-3 วินาที** เปรียบเทียบกับ VM ที่ต้องใช้เวลาบูตหลายนาที
3. **Microservices & PaaS Compatibility:** Container สอดคล้องกับมาตรฐาน Cloud-Native สามารถนำไปปรับใช้บนแพลตฟอร์มคลาวด์ เช่น Render, Railway หรือ Fly.io ได้ทันทีโดยไม่มี Ops Overhead

### 3.2 ตารางเปรียบเทียบ Container vs Virtual Machine (VM)

| ประเด็นเปรียบเทียบ | Container (Docker - เลือกใช้) | Virtual Machine (VM - ไม่เลือก) |
| :--- | :--- | :--- |
| **ระดับสถาปัตยกรรม (Level)** | OS-level Virtualization (แชร์ Host Kernel) | Hardware-level Virtualization (มี Guest OS แยก) |
| **ขนาดของ Image (Size)** | **ขนาดเล็ก (~125 MB)** เนื่องจากมีเพียง App + Deps | **ขนาดใหญ่ (5 - 20 GB)** เนื่องจากรวม Guest OS เต็มรูปแบบ |
| **ความเร็วในการเริ่มทำงาน** | **รวดเร็วมาก (2–3 วินาที)** | **ช้า (1–3 นาที)** ต้องรอนับตั้งแต่งานบูต OS |
| **การใช้ทรัพยากร (Overhead)**| **ต่ำมาก** กิน RAM/CPU เท่าที่แอปพลิเคชันใช้จริง | **สูงมาก** เสีย RAM/CPU ให้กับ Guest OS ค้างไว้ตลอดเวลา |

---

## 4. มาตรการด้านความมั่นคงปลอดภัยใน Dockerfile (Security Best Practices)
1. **Non-Root User Enforcement:** ใช้คำสั่ง `USER nextjs` เพื่อป้องกันภัยคุกคามในกรณีที่ Container ถูกโจมตี (Container Escape Attack)
2. **Minimal Base Image:** เลือกใช้ `node:20-alpine` เพื่อลดจำนวน Packages ที่ไม่จำเป็น และลดช่องโหว่ความปลอดภัย (Attack Surface)
3. **Strict Secret Exclusion:** ใช้งาน `.dockerignore` อย่างเข้มงวดเพื่อสกัดกั้นไฟล์ `.env` และ `.git` ไม่ให้หลุดเข้าไปใน Container Image
