# 🛠️ Tech Stack Specification & Architectural Rationale — UP-Notes

เอกสารสรุปการตัดสินใจเลือกเทคโนโลยี (**Tech Stack**) สำหรับแพลตฟอร์ม **UP-Notes** ครอบคลุมทั้ง 5 เลเยอร์ พร้อมเหตุผลเชิงบริบท (Context-driven Rationale) และทางเลือกอื่นที่ได้รับการพิจารณา (Alternatives Considered)

---

## 📋 สรุปตาราง Tech Stack ทั้ง 5 เลเยอร์

| Layer | Choice (เทคโนโลยีที่เลือก) | Rationale เชิงบริบท (เหตุผลในการเลือก) | Alternative Considered (ทางเลือกอื่นและเหตุผลที่ไม่เลือก) |
| :--- | :--- | :--- | :--- |
| **1. Frontend Layer** | **Next.js 14 (App Router) + TypeScript + Tailwind CSS** | • รองรับ Server-Side Rendering (SSR) ช่วยให้การค้นหาชีทสรุปติดอันดับ SEO ง่ายขึ้น<br>• มี Type Safety ทั้งระบบ ลดข้อผิดพลาด Runtime TypeError<br>• Tailwind CSS ช่วยสร้าง Responsive UI สำหรับสมาร์ตโฟนได้อย่างรวดเร็ว | • **React + Vite:** ขาด Server Components และการทำ SSR ในตัว ต้องตั้งค่า Router แยกเอง<br>• **Vue.js / Nuxt:** สมาชิกในทีมมีความคุ้นเคยกับนิเวศวิทยาของ React/TypeScript มากกว่า |
| **2. Backend Layer** | **Next.js Route Handlers + Node.js runtime** | • สถาปัตยกรรมแบบ Unified Codebase ทำให้พัฒนา Frontend และ Backend ในกิ่งเดียว (Monorepo-style)<br>• ลดความยุ่งยากในการ Deploy เหลือเพียง 1 Deployment Unit<br>• เหมาะกับทีมขนาด 4 คนระยะเวลาพัฒนา 8 สัปดาห์ | • **Python (FastAPI):** เด่นเรื่อง Data Science/AI แต่ต้องแยกเป็น 2 Repositories และเพิ่ม Ops Overhead ในการจัดการ 2 Runtimes<br>• **Express.js (Separated Server):** เพิ่มความซับซ้อนในการตั้งค่า CORS และ Deployment |
| **3. Database Layer** | **PostgreSQL + Prisma ORM** | • PostgreSQL มีความสัมพันธ์ข้อมูลที่แข็งแกร่ง (Relational ACID Compliance) เหมาะกับโครงสร้างรหัสวิชา นิสิต ยอดไลก์ และการรายงานปัญหา<br>• Prisma ORM มี Auto-generated TypeScript Types ช่วยให้เขียน Query ได้อย่างปลอดภัยและมี Autocomplete | • **MongoDB (NoSQL):** โครงสร้างข้อมูลแบบ Schemaless ไม่เหมาะกับระบบที่มีความสัมพันธ์ข้อมูลชัดเจน (นิสิต 1 คนมีหลายโน้ตย่อ/ไลก์)<br>• **SQLite:** ไม่รองรับ Concurrent Writes สูงในช่วงก่อนสอบ |
| **4. Auth & Storage Layer** | **Supabase Auth + Supabase Object Storage** | • มีระบบการจัดการ User Session และ Row Level Security (RLS) ในตัว<br>• Object Storage รองรับการเก็บไฟล์ PDF/Images ขนาดใหญ่ได้ปลอดภัยโดยไม่ต้องเขียนแผงเซิร์ฟเวอร์เก็บไฟล์เอง<br>• มี Free Tier ที่เพียงพอกับผู้ใช้ในระยะเริ่มต้น | • **Firebase / GCP Bucket:** การตั้งค่าสิทธิ์เข้าถึงซับซ้อนกว่า และต้องจ่ายค่าบริการตามริมาณการรับส่งข้อมูล (Egress Cost) สูงกว่า<br>• **Custom JWT + AWS S3:** ต้องใช้เวลาตั้งค่าแฮชรหัสผ่านและนโยบาย S3 นานเกินไป |
| **5. Container & Hosting Layer** | **Docker + Docker Compose (Deployment: Vercel / Railway)** | • Docker ช่วยสร้างสภาพแวดล้อมแวดล้อมที่เหมือนกัน 100% ทั้งบนเครื่องนิสิตและเซิร์ฟเวอร์การผลิต (Eliminate "Works on my machine")<br>• Vercel/Railway มีการบูรณาการเข้ากับ GitHub Push อัตโนมัติ (Zero Ops Overhead) | • **AWS ECS / Kubernetes (K8s):** มีความซับซ้อนและค่าใช้จ่ายสูงเกินไปสำหรับทีมขนาดเล็กที่ไม่มี Dedicated DevOps Engineer |

---

## 🔍 วิเคราะห์การตัดสินใจเชิงสถาปัตยกรรม (Architectural Analysis)

การเลือก Tech Stack ข้างต้นตอบโจทย์ข้อกำหนดเชิงคุณภาพ (NFR) จาก Lab 3 ดังนี้:
1. **Performance Efficiency:** ใช้ Next.js App Router ทำ Server-Side Caching ทำให้พรีวิวและดาวน์โหลดเอกสารได้เร็ว Response Time ≤ 1.5s
2. **Developer Productivity & Maintainability:** การใช้ TypeScript แบบ Full-stack (Frontend + Backend + ORM) ทำให้เกิด End-to-End Type Safety ป้องกันการใช้ `any` และช่วยให้การทำ Code Review รวดเร็วขึ้น
3. **Zero Ops Overhead:** การเลือกใช้ Supabase Cloud Managed DB + Vercel Hosting ช่วยให้ทีมโฟกัสที่การพัฒนาฟีเจอร์หลัก (Product Features) ได้อย่างเต็มที่โดยไม่ต้องเสียเวลาดูแลเซิร์ฟเวอร์
