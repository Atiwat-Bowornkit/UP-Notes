# 📦 C4 Model — Level 2: Container Diagram (UP-Notes)

แผนภาพ **C4 Level 2: Container Diagram** แสดงส่วนประกอบระดับคอนเทนเนอร์ (Containers) เทคโนโลยีที่เลือกใช้ และโปรโตคอลการสื่อสารภายในระบบ **UP-Notes**

---

## 1. C4 Container Diagram (Mermaid)

```mermaid
C4Container
    title C4 Level 2: Container Diagram for UP-Notes Platform

    Person(user, "User (Student / Instructor / Admin)", "ผู้ใช้งานเข้าถึงแพลตฟอร์มผ่านเว็บเบราว์เซอร์บน PC หรือมือถือ")

    Container_Boundary(upnotes_boundary, "UP-Notes System Boundary") {
        Container(web_app, "Frontend Web Application", "Next.js 14 (App Router) + TypeScript + Tailwind CSS", "ให้บริการอินเทอร์เฟซผู้ใช้งาน หน้าค้นหา พรีวิวเอกสาร และฟอร์มอัปโหลด")
        Container(api_server, "Backend REST API & Server Actions", "Next.js Route Handlers + TypeScript + Prisma ORM", "จัดการ Business Logic, การตรวจสอบสิทธิ์, การค้นหา และการควบคุมการทำงาน")
        ContainerDb(database, "Relational Database", "PostgreSQL (Supabase Managed DB)", "จัดเก็บข้อมูลบัญชีผู้ใช้, ข้อมูลโน้ตย่อ, รหัสวิชา, ยอดไลก์ และประวัติการรายงานปัญหา")
        Container(file_storage, "Object File Storage", "Supabase Storage (Cloud Bucket)", "จัดเก็บไฟล์เอกสารสรุป PDF ฉบับเต็ม และภาพพรีวิว Thumbnail")
    }

    System_Ext(upmail, "UP Mail Gateway", "ระบบอีเมลยืนยันตัวตน @up.ac.th")

    Rel(user, web_app, "เข้าใช้งานผ่านอินเทอร์เน็ต", "HTTPS / HTML & JS")
    Rel(web_app, api_server, "ส่งคำขอข้อมูลและเรียกใช้ API", "HTTPS / JSON / Server Actions")
    Rel(api_server, database, "อ่านและบันทึกข้อมูลแบบ ACID", "Prisma Client / SQL (TCP:5432)")
    Rel(api_server, file_storage, "อัปโหลด/ดาวน์โหลดไฟล์เอกสาร", "HTTPS / Supabase JS SDK / RLS")
    Rel(api_server, upmail, "ส่งคำขอส่งอีเมลยืนยันตัวตน", "HTTPS / SMTP")
```

---

## 2. รายละเอียดเทคโนโลยีและความรับผิดชอบของแต่ละ Container

| Container Name | Technology Stack | บทบาทและความรับผิดชอบหลัก |
| :--- | :--- | :--- |
| **Frontend Web App** | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui | ให้บริการหน้าเว็บฝั่งผู้ใช้ (Client Interface), รองรับการแสดงผล Responsive ทั้ง PC และมือถือ, แสดงผลพรีวิว PDF และจัดการ UI State |
| **Backend REST API** | Next.js Route Handlers, TypeScript, Prisma ORM | ให้บริการ RESTful API, บังคับใช้ Business Rules, การตรวจสอบความถูกต้องของข้อมูล (Validation), และควบคุมการเข้าถึงสิทธิ์ (Authorization) |
| **Relational Database** | PostgreSQL (Supabase Managed) | จัดเก็บข้อมูลเชิงโครงสร้างที่มีความสัมพันธ์ (Relational Data) อย่างปลอดภัยตามมาตรฐาน ACID |
| **Object File Storage** | Supabase Storage (S3-Compatible Bucket) | จัดเก็บไฟล์สื่อไบนารีขนาดใหญ่ (PDF, PNG, JPG) พร้อมบังคับใช้ Row Level Security (RLS) เพื่อป้องกันการแอบเข้าถึงไฟล์ |
