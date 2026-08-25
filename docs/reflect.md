# 💭 Reflection Document (Post-quiz 4 Exit Ticket) — Lab 4

เอกสารการสะท้อนคิด (Reflection & Exit Ticket) สำหรับ **Lab 4: Rapid Prototyping with AI**

---

## 1. การประยุกต์ใช้ Five S's Prompting กับ Generative AI
* **ประเด็นการเรียนรู้:** การสั่งงาน Generative AI (เช่น ChatGPT/Copilot) ด้วยคำสั่งทั่วไปจะได้โค้ดที่ไม่ตรงตามความต้องการ แต่เมื่อนำหลักการ **Five S's (Structured, Surrounding, Single task, Specific, Short)** มาปรับใช้ เช่น ระบุขอบเขตเทคโนโลยี (Vanilla HTML/CSS/JS), กำหนด Class Name และพฤติกรรม Event Listener ชัดเจน ช่วยให้ได้โค้ด Skeleton ที่ถูกต้องรวดเร็วขึ้นอย่างมาก
* **การนำไปใช้:** ทีมต้องเป็นผู้ทบทวนโค้ด (Reviewer) และปรับแต่งรายละเอียดภาษาไทย/คำอธิบายโดเมนเองอย่างน้อย 50% เพื่อให้โค้ดตรงกับเกณฑ์และบริบทจริงของ มพ.

---

## 2. ความเข้าใจระหว่าง Prototype vs Tracer Bullet
* **ประเด็นการเรียนรู้:** Prototype เป็นโค้ดที่สร้างขึ้นเพื่อตอบคำถามและทดสอบ UX/UI กับผู้ใช้ ซึ่งสามารถทิ้งได้ (Throwaway Code) ส่วน Tracer Bullet เป็นโครงสร้าง End-to-End เล็กๆ ที่เชื่อมต่อระบบจริงทุกเลเยอร์และพร้อมต่อยอด
* **ข้อสรุปสำหรับ Sprint 1:** การเลือกทำ Prototype ใน Sprint 1 ช่วยให้ทีมมองเห็นภาพรวมหน้าตาของระบบ UP-Notes ทุกส่วน (Search, Preview, Upload, Admin, Login) ก่อนที่จะตกลงเขียนโครงสร้าง Backend และ Database ใน Sprint ถัดไป

---

## 3. การควบคุมขอบเขตและข้อระวังในการทำ Rapid Prototyping
* **ประเด็นการเรียนรู้:** ข้อควรระวังสำคัญคือการหลีกเลี่ยงการดึง Framework ขนาดใหญ่เกินไปมาใช้ในขั้น Prototype เพราะจะทำให้ทีมเสียเวลากับการแก้ Configuration แทนที่จะโฟกัสที่การทดสอบ User Flow
* **ผลลัพธ์:** การใช้ Vanilla HTML/CSS/JS ช่วยให้ Prototype รันบนเบราว์เซอร์ได้ทันที ไม่ต้องมี Build step และเปิดทดสอบได้อย่างลื่นไหล
