# ⚙️ Non-Functional Requirements (NFR) Document — UP-Notes

เอกสารกำหนด **ข้อกำหนดเชิงฟังก์ชันที่ไม่ใช่ฟีเจอร์หลัก (Non-Functional Requirements: NFR)** ของระบบ **UP-Notes** ทั้งหมด 6 ข้อ โดยทุกข้อได้รับการออกแบบให้ **วัดผลได้อย่างเป็นรูปธรรม (Measurable Metrics)** ครอบคลุม 5 หมวดหมู่หลักตามมาตรฐาน ISO/IEC 25010

---

## 1. หมวดหมู่ประสิทธิภาพการทำงาน (Performance Efficiency)

### NFR-01: ระยะเวลาตอบสนองการค้นหาและการพรีวิว (Response Time & Latency)
* **ข้อกำหนด:** ระบบต้องตอบสนองการค้นหาโน้ตย่อและการโหลดหน้าพรีวิวเอกสารขนาด 3 หน้าแรก โดยมีระยะเวลาตอบสนอง (Response Time) ไม่เกิน **1.5 วินาที** ที่ค่า Percentile 95 (p95) ภายใต้สภาวะที่มีคำขอค้นหา 50 คำขอต่อวินาที
* **ตัวเกณฑ์วัดผล (Metric):**
  * Average Search Response Time ≤ 800ms
  * p95 Latency ≤ 1,500ms (1.5 วินาที)
  * Page Load Time บน Mobile Web (3G connection) ≤ 2.5 วินาที

---

## 2. หมวดหมู่ความมั่นคงปลอดภัย (Security)

### NFR-02: นโยบายรหัสผ่านและการควบคุมสิทธิ์การเข้าถึง (Authentication & Access Control)
* **ข้อกำหนด:** ระบบต้องบังคับใช้รหัสผ่านที่มีความยาวอย่างน้อย **8 ตัวอักษร** ประกอบด้วยตัวอักษรอังกฤษตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก และตัวเลข พร้อมทั้งกำหนดให้ Session การล็อกอินหมดอายุ (Session Timeout) ภายใน **60 นาที** หากไม่มีการเคลื่อนไหว (Inactivity)
* **ตัวเกณฑ์วัดผล (Metric):**
  * Password Complexity Rule Validation = 100%
  * User Inactivity Session Expiration = 60 นาที (±1 นาที)
  * การส่งผ่านข้อมูลทั้งหมดต้องผ่านโปรโตคอล HTTPS (TLS 1.3) 100%

---

## 3. หมวดหมู่ความพร้อมใช้งานและการรองรับขยายตัว (Availability & Scalability)

### NFR-03: ความพร้อมใช้งานของระบบในช่วงสัปดาห์สอบ (System Availability)
* **ข้อกำหนด:** ระบบต้องมีความพร้อมใช้งาน (Uptime) ไม่น้อยกว่า **99.5%** ตลอดช่วงเวลา 07:00–23:00 น. ในช่วง 2 สัปดาห์ก่อนสอบและระหว่างสอบของมหาวิทยาลัยพะเยา (Downtime ไม่เกิน 3.6 ชั่วโมงต่อเดือน)
* **ตัวเกณฑ์วัดผล (Metric):**
  * Monthly System Availability ≥ 99.5%
  * Mean Time to Recovery (MTTR) เมื่อระบบล่ม ≤ 15 นาที

### NFR-04: การรองรับจำนวนผู้ใช้งานพร้อมกัน (Concurrent Users Capacity)
* **ข้อกำหนด:** ระบบต้องรองรับผู้ใช้งานที่เข้ามาค้นหาและดาวน์โหลดเอกสารพร้อมกัน (Concurrent Active Users) ได้อย่างน้อย **150 คน** โดยที่อัตราการเกิดข้อผิดพลาดของคำขอ (Error Rate) ต้องไม่เกิน **0.1%**
* **ตัวเกณฑ์วัดผล (Metric):**
  * Supported Concurrent Users ≥ 150 users
  * HTTP 5xx Server Error Rate ≤ 0.1%

---

## 4. หมวดหมู่ความง่ายในการใช้งาน (Usability)

### NFR-05: ประสิทธิภาพการใช้งานของผู้ใช้ใหม่ (Task Success Rate & Speed)
* **ข้อกำหนด:** นิสิตผู้ใช้งานใหม่ที่เพิ่งเข้าสู่ระบบครั้งแรก ต้องสามารถทำภารกิจหลัก "ค้นหาวิชาที่ต้องการ และกดพรีวิวดูโน้ตย่อ" ได้สำเร็จภายในเวลาไม่เกิน **2 นาที (120 วินาที)** โดยไม่ต้องอ่านคู่มือการใช้งาน
* **ตัวเกณฑ์วัดผล (Metric):**
  * First-time User Task Completion Time ≤ 120 วินาที
  * Task Completion Success Rate ≥ 90% ของกลุ่มตัวอย่างการทดสอบ Usability Test (10 คน)

---

## 5. หมวดหมู่การบำรุงรักษาและการรองรับอนาคต (Maintainability & Portability)

### NFR-06: ความครอบคลุมของการทำคอนเทนเนอร์และความสะอาดของโค้ด (Code Standards & Containerization)
* **ข้อกำหนด:** ซอร์สโค้ดทั้งหมดต้องถูกจัดตั้งสถาปัตยกรรมด้วย Docker Container ที่สามารถสั่งรันผ่าน `docker compose up` ได้สำเร็จบนระบบปฏิบัติการ Linux, macOS และ Windows โดยปราศจาก TypeScript Warning หรือ Type `any` ในระดับ Production Build
* **ตัวเกณฑ์วัดผล (Metric):**
  * Container Build Success Rate = 100%
  * TypeScript Strict Mode Compliance = 100% (No `any` or ignored lint warnings)
