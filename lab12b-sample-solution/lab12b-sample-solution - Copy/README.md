# Lab12B Solution — Safety Net Sprint (เฉลยที่รันได้จริง)

โฟลเดอร์นี้คือ **เฉลย** ของ `Lab12B-W12_Safety_Net_Sprint.md` — โครงเดียวกับ **Campus Eats** ใน Lab 9
ใช้เป็นต้นแบบได้ทั้งชิ้น (หรือคัดลอก `ci.yml` + เทสต์ไปปรับกับโปรเจกต์ทีม)

## วิธีรัน + ผลลัพธ์ที่ควรได้

```powershell
pip install -r requirements.txt
python -m pytest
```

ผลลัพธ์จริง (ตรวจเมื่อ 2026-09-23 · Python 3.14.6 · pytest 9.1.1):

```
tests/test_calc.py::test_vip_gets_15_percent PASSED                      [ 12%]
tests/test_calc.py::test_promo_overrides_member PASSED                   [ 25%]
tests/test_calc.py::test_boundary_promo_len_5_ignored PASSED             [ 37%]
tests/test_calc.py::test_zero_total_is_free PASSED                       [ 50%]
tests/test_calc.py::test_short_promo_code_raises PASSED                  [ 62%]
tests/test_calc.py::test_promo_code_with_symbol_raises PASSED            [ 75%]
tests/test_calc.py::test_payable_after_discount PASSED                   [ 87%]
tests/test_calc.py::test_valid_promo_code_is_uppercased PASSED           [100%]

=============================== tests coverage ================================
Name              Stmts   Miss Branch BrPart  Cover   Missing
-------------------------------------------------------------
src\__init__.py       0      0      0      0   100%
src\calc.py          17      0      6      0   100%
-------------------------------------------------------------
TOTAL                17      0      6      0   100%
============================== 8 passed in 0.12s ==============================
```

ตรวจ lint (ให้ตรงกับ job `lint` ใน CI) — ต้องขึ้น `All checks passed!`

```powershell
python -m ruff check .
```

## โครงสร้างไฟล์

```
src/calc.py                    — business logic: calculate_discount / calculate_payable / validate_promo_code
tests/test_calc.py             — 8 เทสต์ (happy 2 · edge 2 · error 2 · payable 1 · bonus 1)
tests/conftest.py              — ทำให้ pytest หา src/ เจอ (จำเป็นบน CI ด้วย)
pytest.ini                     — ตั้ง addopts ให้รัน coverage อัตโนมัติ
requirements.txt               — pytest · pytest-cov · ruff
.github/workflows/ci.yml       — CI 2 jobs (lint + test) + หมายเหตุ Branch Protection
docs/safety-net.md             — เอกสารที่ต้องส่ง (กรอกครบ เป็นตัวอย่าง)
AI_USAGE.md                    — บันทึกการใช้ AI (ตัวอย่าง)
reflect.md                     — Post-quiz 12 ที่ merge เข้า PR (ตัวอย่าง)
```

## ตอบโจทย์ rubric ไหนบ้าง (7%)

| ส่วน | หลักฐานในโฟลเดอร์นี้ |
|---|---|
| **Lab 9 — Testing (3.5%)** | `tests/test_calc.py` 8 เทสต์ครบ 3 ประเภท + coverage 100% + การตีความใน `docs/safety-net.md` §3 |
| **Lab 10 — CI (3.5%)** | `.github/workflows/ci.yml` (lint + test) + ขั้นตอน/หลักฐาน Branch Protection ใน `docs/safety-net.md` §4 |

## วิธีทำ Branch Protection + เก็บหลักฐาน (ตามขั้น 5.7–5.8 ของใบงาน)

1. Push โฟลเดอร์นี้ขึ้น repo ตัวอย่าง → เปิด PR เข้า `main`
2. รอ CI เขียวทั้ง 2 jobs → Settings → Branches → Require status checks → เลือก `lint`, `test`
3. แก้ `assert calculate_discount(1000, "vip", None) == 150` ให้เป็น `== 999` → commit → push
4. แคปหน้า PR ที่ขึ้น **"Merging is blocked"** เก็บไว้เป็นหลักฐาน
5. แก้กลับเป็น `== 150` → push → CI เขียว → merge ได้

## หมายเหตุ 2 ข้อ (จุดที่คนมักพลาด)

1. **Semantics**: `calculate_discount` คืน **จำนวนส่วนลด** (150) ไม่ใช่ยอดสุทธิ — ยอดสุทธิคือ `calculate_payable` (850)
   ถ้าโปรเจกต์ทีมคืนยอดสุทธิ ให้ตั้งชื่อเทสต์และค่าตามจริงของทีม (ห้ามลอกค่ามั่ว)
2. **`pytest.ini` ต้องใช้ section `[pytest]`** — ถ้าเขียน `[tool.pytest.ini_options]` (ซึ่งเป็นของ `pyproject.toml`)
   ค่า `addopts` จะถูก **เมินเงียบๆ** ทำให้ coverage ไม่ทำงาน (บทเรียน: config ที่ผิดที่ = ไม่ error แต่ไม่ทำงาน)