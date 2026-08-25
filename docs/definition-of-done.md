# 🎯 Definition of Done (DoD) — Team CS-Sheet-67

เอกสารฉบับนี้กำหนดเกณฑ์ความสำเร็จ (Definition of Done) ที่สมาชิกทุกคนในทีม CS-Sheet-67 ต้องยึดถือร่วมกัน ก่อนที่จะย้าย User Story หรือ Task ใดๆ จากรายการ **In Progress / Review** ไปยัง **Done** บน GitHub Project Board

---

## 📋 เกณฑ์มาตรฐาน Definition of Done (6 ข้อหลัก)

1. **ผ่านการทำ Code Review และได้รับอนุมัติ (Approval):**
   * ซอร์สโค้ดต้องถูกส่งผ่าน Pull Request (PR) ไปยังกิ่งหลัก `main` เท่านั้น (ห้าม Push ตรง `main`)
   * ต้องได้รับคำอนุมัติ (Approve) จากเพื่อนร่วมทีมอย่างน้อย **1 คน** หลังตรวจทานตามมาตรฐาน Code Review Checklist

2. **เกณฑ์คุณภาพโค้ดและ Type Safety (Clean Code Standards):**
   * โค้ดต้องไม่มีการใช้ `any` ใน TypeScript หรือการเขียน Type Casting แบบขอไปที
   * ต้องไม่มี Linting Error หรือ Compiler Warning ที่ถูกเพิกเฉย
   * ต้องไม่มีการ Hardcode ข้อมูลความลับ (Secrets / API Keys / Password) ในซอร์สโค้ด โดยให้แยกไปใช้ `.env` เสมอ

3. **User Story & Acceptance Criteria ครบถ้วน:**
   * ฟีเจอร์ที่พัฒนาต้องผ่านการทดสอบเกณฑ์การรับรอง (Acceptance Criteria) ครบทุกข้อตามที่ระบุไว้ใน Issue
   * โค้ดที่พัฒนาต้องไม่ทำให้ฟีเจอร์เดิมของระบบพังเสียหาย (No Regression Bugs)

4. **การทดสอบและการรันบน Container (Docker Verification):**
   * โค้ดใหม่ต้องสามารถ Build และรันบนสภาพแวดล้อม Docker Container (`docker build` / `docker compose`) ได้สำเร็จโดยไม่เกิด Runtime Crash

5. **เอกสารระบบและการอัปเดต (Documentation Updated):**
   * เอกสารที่เกี่ยวข้อง เช่น `README.md`, Architectural Decision Records (ADRs), หรือ API Specifications ต้องได้รับการอัปเดตให้สอดคล้องกับโค้ดที่เปลี่ยนแปลง
   * หากมีการใช้ Generative AI ในการพัฒนา ต้องลงบันทึกไว้ใน `AI_USAGE.md` หรือ PR Description

6. **สถานะบน Project Board และ Issue Tracking:**
   * GitHub Issue / PR คาร์ด ต้องถูกย้ายไปที่คอลัมน์ **Done** บน GitHub Project Board
   * Issue ที่เกี่ยวข้องบน GitHub ต้องได้รับการ Link เข้ากับ PR และปิดสถานะเป็น **Closed**
