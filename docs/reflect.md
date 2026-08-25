# 💭 Reflection Document (Post-quiz 6 Exit Ticket) — Lab 6

เอกสารการสะท้อนคิด (Reflection & Exit Ticket) สำหรับ **Lab 6: First Container (Dockerfile + Build + Push)**

---

## 1. การทำ Containerization ด้วย Dockerfile Best Practices
* **ประเด็นการเรียนรู้:** การเขียน Dockerfile สำหรับ Production ไม่ใช่แค่การรัน `FROM node` แล้ว `COPY . .` แต่ต้องคำนึงถึง Security และ Image Size การเลือกใช้ **Multi-stage Build** และ **Base Image แบบ Alpine (`node:20-alpine`)** ช่วยลดขนาด Image ลงจาก >900MB เหลือเพียง ~125MB
* **มาตรการความปลอดภัย:** การกำหนดคำสั่ง `USER nextjs` เพื่อสลับการรันแอปพลิเคชันจาก Root ไปยัง Non-root User และการสกัดกั้นไฟล์ `.env` ด้วย `.dockerignore` เป็นแนวปฏิบัติสำคัญในการป้องกันการรั่วไหลของข้อมูลลับ

---

## 2. ความเข้าใจเรื่อง Container vs Virtual Machine (VM)
* **ประเด็นการเรียนรู้:** อ้างอิงจาก [ESP] §5.4 Container ทำงานบนระดับ OS Virtualization โดยแชร์ Kernel ร่วมกับ Host OS ทำให้ประหยัดทรัพยากรและบูตขึ้นมาทำงานได้ในเวลาไม่กี่วินาที ในขณะที่ VM ต้องแบกรับ Guest OS ทั้งหมด
* **ประโยชน์ที่ได้รับ:** สถาปัตยกรรมแบบ Container เหมาะสมที่สุดสำหรับแพลตฟอร์ม UP-Notes เพราะช่วยให้การ Deploy บนบริการ Cloud PaaS ทำได้ง่าย รวดเร็ว และสามารถรันสภาพแวดล้อมเดียวกันทั้งบนเครื่องนักพัฒนาและเซิร์ฟเวอร์จริง

---

## 3. การออกแบบ REST API และ Service Decomposition (Rule of Twos)
* **ประเด็นการเรียนรู้:** การแยกแยะบริการ (Service Decomposition) ต้องสอดคล้องกับหลัก **Rule of Twos** คือ ทีมงานขนาดเล็ก (≤ 2 pizzas) ระยะเวลาพัฒนาสั้น (≤ 2 สัปดาห์ต่อรอบ) และบริการมีความรับผิดชอบเดียว (Single Responsibility) การเลือก Containerize บริการเว็บและ API หลักในสัปดาห์นี้ช่วยให้ทีมพร้อมต่อยอดไปสู่ระบบ CI/CD Automation ในบทเรียนถัดไป
