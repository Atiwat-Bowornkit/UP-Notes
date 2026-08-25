# 🗺️ C4 Model — Level 1: System Context Diagram (UP-Notes)

แผนภาพ **C4 Level 1: System Context Diagram** แสดงขอบเขตของระบบ **UP-Notes** การโต้ตอบกับผู้ใช้งานกลุ่มต่างๆ และการเชื่อมต่อกับระบบภายนอก (External Systems)

---

## 1. C4 System Context Diagram (Mermaid)

```mermaid
C4Context
    title C4 Level 1: System Context Diagram for UP-Notes Platform

    Person(student, "นิสิต มพ. (Students)", "ค้นหา พรีวิว ดาวน์โหลด และอัปโหลดชีทสรุปบทเรียนประจำรายวิชา")
    Person(instructor, "อาจารย์ผู้สอน (Instructors)", "เข้าดูสรุปยอดนิยมและรายงานเนื้อหาที่ไม่ถูกต้องหรือละเมิดลิขสิทธิ์")
    Person(admin, "ผู้ดูแลระบบ (Admin)", "ตรวจสอบรายงานปัญหา จัดการผู้ใช้ และอนุมัติการลบไฟล์")

    System(upnotes, "UP-Notes Platform", "ระบบศูนย์กลางคลังปันสรุปบทเรียนและโน้ตย่อสำหรับนิสิต มหาวิทยาลัยพะเยา")

    System_Ext(supabase, "Supabase Cloud Services", "ให้บริการ Database (PostgreSQL), Auth และ Object Storage สำหรับเก็บไฟล์สรุป PDF/Images")
    System_Ext(upmail, "UP Mail System (@up.ac.th)", "ระบบส่งอีเมลยืนยันตัวตนและรับการแจ้งเตือนสิทธิ์นิสิต มพ.")

    Rel(student, upnotes, "ค้นหา พรีวิว ไดน์โหลด และอัปโหลดชีทสรุป", "HTTPS / Web Browser")
    Rel(instructor, upnotes, "ตรวจดูสรุปวิชาที่สอน และรายงานปัญหา", "HTTPS / Web Browser")
    Rel(admin, upnotes, "จัดการรายงานปัญหาและลบไฟล์ละเมิด", "HTTPS / Web Browser")

    Rel(upnotes, supabase, "จัดเก็บ/ดึงข้อมูลนิสิต, โน้ตย่อ และไฟล์เอกสาร", "HTTPS / REST API / RLS")
    Rel(upnotes, upmail, "ส่งอีเมลยืนยันตัวตน OTP / Verification Link", "SMTP / HTTPS")
```

---

## 2. อธิบายองค์ประกอบและขอบเขตระบบ (System Elements Description)

### 👥 ผู้ใช้งานระบบ (Users / Actors)
1. **นิสิต มพ. (Students):** ผู้ใช้งานหลัก เข้ามาค้นหาชีทสรุปตามรหัสวิชา พรีวิวเอกสาร กดไลก์ ดาวน์โหลดไฟล์ PDF ออฟไลน์ และอัปโหลดชีทสรุปของตนเอง
2. **อาจารย์ผู้สอน (Instructors):** เข้ามาตรวจดูชีทสรุปวิชาที่ตนเองสอนเพื่อเช็กความถูกต้อง และรายงานไฟล์ข้อสอบเก่าที่ไม่อนุญาตให้เผยแพร่
3. **ผู้ดูแลระบบ (Admin):** ตรวจสอบรายงานปัญหา (Reports), อนุมัติการลบไฟล์ที่ละเมิดลิขสิทธิ์ และดูแลความสะอาดของระบบ

### ⚙️ ระบบหลัก (Main System)
* **UP-Notes Platform:** ระบบเว็บแอปพลิเคชันหลักที่ให้บริการจัดการโน้ตย่อ ค้นหารหัสวิชา พรีวิวเอกสาร และบริหารจัดการข้อมูลสรุปบทเรียน

### 🌐 ระบบภายนอก (External Systems)
1. **Supabase Cloud Services:** ให้บริการโครงสร้างพื้นฐานคลาวด์ ได้แก่ Database (PostgreSQL), Authentication Engine และ Object Storage สกัดกั้นการเข้าถึงไฟล์ที่ไม่ได้รับสิทธิ์ด้วย Row Level Security (RLS)
2. **UP Mail System (@up.ac.th):** ระบบอีเมลของมหาวิทยาลัยพะเยา ใช้ในการรับลิงก์ยืนยันตัวตนเพื่อการันตีว่าเป็นนิสิต มพ. จริง
