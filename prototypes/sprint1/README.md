# 🎨 Sprint 1 Prototype & Tracer Bullet Specification — UP-Notes

เอกสารอธิบายการออกแบบต้นแบบ (Prototype Design Document) ประจำ **Sprint 1 (Lab 4)** ของแพลตฟอร์ม **UP-Notes**

---

## 📌 1. ฟีเจอร์ที่อ้างอิงจาก User Stories (Lab 3)
ต้นแบบนี้พัฒนาขึ้นเพื่อทดลองพฤติกรรมโต้ตอบ (Interactive Behavior) ของ User Stories ระดับ Must & Should Have หลักดังนี้:
* **US-02:** ค้นหาชีทสรุปบทเรียนตามรหัสวิชาและชื่อวิชา
* **US-04:** พรีวิวเอกสารสรุปบทเรียนบนเบราว์เซอร์
* **US-05:** กดถูกใจ (Like) เพื่อส่งกำลังใจและจัดอันดับสรุปยอดนิยม
* **US-06:** ดาวน์โหลดไฟล์เอกสารสรุปบทเรียนลงอุปกรณ์

---

## 🎯 2. การตัดสินใจ: Prototype vs. Tracer Bullet
* **การตัดสินใจของทีม:** เลือกทำแบบ **Prototype ( Throwaway Prototype )**
* **เหตุผลประกอบ:** 
  1. เพื่อทดสอบสมมติฐานความง่ายในการใช้งาน (Usability Assumption) และ User Experience (UX) ในการพรีวิวชีทสรุปและการกดไลก์ผ่านหน้าเว็บให้ชัดเจนก่อนเริ่มเขียนโค้ด Backend จริง
  2. เพื่อตกลง Design System กลาง (Color Palette, Layout Grid, Button Component) ร่วมกันในทีมระหว่างส่วนของ Student Dashboard, Admin Dashboard, Login และ Upload Page
  3. โค้ด HTML/CSS/JS ในโฟลเดอร์นี้มีเป้าหมายเพื่อตอบคำถาม "ทีมและผู้ใช้เข้าใจตรงกันหรือไม่" และสามารถทิ้งหรือรีแฟกเตอร์ใหม่ได้เมื่อเริ่มพัฒนาด้วย Next.js/React ใน Sprint ถัดไป (ตรงตามหลักการ [PP] Tip 21)

---

## ✅ 3. สิ่งที่ทำได้ใน Prototype นี้ (What Works)
1. **Interactive Search & Filter:** สามารถพิมพ์ค้นหารหัสวิชา (เช่น `225311`, `225211`) หรือชื่อวิชา และกดปุ่มกรองตามหมวดหมู่เพื่อแสดงผลการ์ดสรุปย่อได้ทันทีแบบ Dynamic
2. **Modal Document Preview:** สามารถกดปุ่ม "พรีวิว" บนการ์ดเพื่อเปิดป๊อปอัปพรีวิวตัวอย่างหน้าเอกสาร พร้อมแสดงปุ่มดาวน์โหลดและปุ่มรายงานปัญหา
3. **Dynamic State Management (Like & Toast):** สามารถกดปุ่มหัวใจเพื่อเพิ่ม/ลดจำนวนไลก์ได้จริงบนหน้าจอ พร้อมแสดงผลการแจ้งเตือนแบบ Toast Notification เมื่อกดไลก์ ดาวน์โหลด หรือส่งรายงานปัญหา

---

## 🚫 4. สิ่งที่ไม่ได้ทำอย่างตั้งใจ (Deliberately Not Implemented)
1. **การเชื่อมต่อฐานข้อมูลและเซิร์ฟเวอร์จริง (Real Backend & DB):** ข้อมูลการ์ดสรุปยังเป็น Mock Data ภายในไฟล์ JavaScript
2. **การอัปโหลดไฟล์จริงลงคลาวด์ (Actual Storage Upload):** ยังไม่มีการเชื่อมต่อ Supabase Storage หรือระบบแปลงไฟล์ PDF เป็นภาพพรีวิว
3. **ระบบรักษาความปลอดภัยและการยืนยันตัวตน (Authentication & Security):** ยังไม่มีการเช็ก Token การล็อกอินหรือการเข้ารหัสรหัสผ่านในหน้ารวม Prototype นี้

---

## ⏩ 5. ขั้นตอนการพัฒนาถัดไปใน Sprint 2 (Next Steps)
1. นำโครงสร้าง Layout และ UI Components จาก Prototype นี้ไปพอร์ตลงใน **Next.js 14 (App Router) + TypeScript**
2. เชื่อมต่อฐานข้อมูล **PostgreSQL ผ่าน Prisma ORM** เพื่อดึงข้อมูลโน้ตย่อและรหัสวิชาจริง
3. เชื่อมต่อระบบอัปโหลดไฟล์เข้ากับ **Supabase Object Storage** พร้อมตั้งค่า Row Level Security (RLS)
