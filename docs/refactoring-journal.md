# 🛠️ Refactoring Journal — UP-Notes

บันทึกการปรับปรุงโครงสร้างโค้ด (Refactoring Journal) ประจำ **Lab 7 (Milestone 1)** เพื่อยกระดับคุณภาพโค้ด ลดความซ้ำซ้อน (DRY Principle) และทดสอบความถูกต้องด้วย Unit Tests

---

## 📌 1. Code Smell ที่พบและระบุตำแหน่ง (Identified Code Smells)

### 1.1 Duplicated Search & Filter Logic (ความซ้ำซ้อนของลอจิกการค้นหา)
* **ตำแหน่ง:** กระจัดกระจายอยู่ตามหน้า HTML Prototype เช่น `index.html` และ `nonthakorn_dashboard_user_prototype.html`
* **ลักษณะ Smell:** มีการเขียนลอจิกวนลูป Array Filtering และ String Case Conversion ซ้ำซ้อนกันในหลายๆ ไฟล์ (DRY Violation) หากต้องการเพิ่มเงื่อนไขการค้นหาใหม่ ต้องไล่แก้ทุกไฟล์พร้อมกัน
* **ผลกระทบ:** เสี่ยงต่อการเกิด Bug เมื่อแก้ไขไม่ครบทุกจุด และไม่สามารถทำ Automated Unit Testing ได้

### 1.2 Magic Numbers ในการตรวจสอบไฟล์อัปโหลด
* **ตำแหน่ง:** ลอจิกการเช็กขนาดไฟล์อัปโหลดในหน้า Upload Note
* **ลักษณะ Smell:** มีการใส่ตัวเลข Hardcoded เช่น `10485760` (10MB) และอาร์เรย์นามสกุลไฟล์ตรงๆ ในหลายตำแหน่งโดยไม่มีการประกาศ Constants
* **ผลกระทบ:** โค้ดอ่านยาก และเสี่ยงต่อการเปลี่ยนค่าขนาดไฟล์ไม่สอดคล้องกันในอนาคต

---

## 🤖 2. การประยุกต์ใช้ AI ในกระบวนการ Refactoring (AI Workflow)

ทีมได้นำกระบวนการ **Explain → Propose → Apply → Test** (SCG Ch.10) มาใช้ดังนี้:

1. **Explain:** ให้ AI ช่วยวิเคราะห์ไฟล์ HTML/JS Prototype เพื่อระบุตำแหน่งที่มี Code Smell และอธิบายเหตุผลผลกระทบ
2. **Propose:** ให้ AI เสนอแนวทางการแยกโมดูลยูทิลิตี้ (Pure Functions) ออกมาเป็น `src/utils/notesHelper.js`
3. **Apply:** ทีมงานทำการทบทวนและลงมือเขียนโค้ดปรับปรุงด้วยตนเอง **≥ 70%** โดยดึงตัวแปรคงที่ (Constants) เช่น `MAX_FILE_SIZE_BYTES` และ `ALLOWED_EXTENSIONS` มาไว้ส่วนบนของโมดูล
4. **Test:** เขียน Automated Unit Test ด้วย Node.js Native Test Runner ใน `tests/notes.test.js` เพื่อตรวจสอบให้แน่ใจว่าการปรับปรุงโค้ดไม่ทำให้ Behavior เดิมของระบบพังเสียหาย (All 5 Tests Pass 100%)

---

## 🔄 3. การเปรียบเทียบ ก่อนและหลัง Refactoring (Before / After Comparison)

| มิติการเปรียบเทียบ | ก่อนปรับปรุง (Before Refactoring) | หลังปรับปรุง (After Refactoring) |
| :--- | :--- | :--- |
| **โครงสร้างโค้ด (Structure)** | Inline Script ซ้ำซ้อนกันใน HTML หลายไฟล์ | สกัดเป็นโมดูลเดี่ยว `src/utils/notesHelper.js` ที่รียูสได้ |
| **การทดสอบความถูกต้อง** | ต้องเปิดเบราว์เซอร์คลิกทดสอบด้วยมือ (Manual Only) | มี Automated Unit Test (`node --test tests/notes.test.js`) 5 Test Cases |
| **ความตรงตามหลัก DRY** | ลอจิกการกรองวิชาและเช็กขนาดไฟล์กระจายอยู่หลายจุด | รวมไว้ที่จุดเดียว (Single Source of Truth) |
| **ความอ่านง่าย (Readability)** | มี Magic Numbers เช่น `10485760` สอดไส้ในโค้ด | ใช้ตัวแปรคงที่ชื่อชัดเจน `MAX_FILE_SIZE_BYTES` |

---

## 🎓 4. บทเรียนที่ได้รับ (Lessons Learned)

1. **Software is Like a Garden ([PP] Tip 65):** ซอฟต์แวร์เหมือนสวนที่ต้องคอยพรวนดินและกำจัดวัชพืช (Code Smells) อย่างสม่ำเสมอ การ Refactor ตั้งแต่ช่วงแรกช่วยป้องกันไม่ให้หนี้ทางเทคนิค (Technical Debt) สะสมจนสายเกินแก้
2. **Tests Pass Before Refactoring ([PP] Tip 40):** การเขียน Unit Test ครอบคลุมพฤติกรรมเดิมก่อนปรับปรุงโค้ด ช่วยสร้างความมั่นใจให้ทีมนักพัฒนาว่าการ Refactor จะไม่ส่งผลกระทบต่อฟีเจอร์เดิมของระบบ
