"""Unit tests — Lab12B Solution (เฉลย)

ครบ 8 เทสต์: happy 2 · edge 2 · error 2 · payable 1 · bonus 1
รัน: python -m pytest -v
"""
import pytest

from src.calc import calculate_discount, calculate_payable, validate_promo_code

# ── HAPPY PATH (2) ────────────────────────────────────────────

def test_vip_gets_15_percent():
    """VIP 1000 บาท ไม่มีโค้ด → ส่วนลด 150 (1000 * 0.15)"""
    # Arrange
    total, tier, code = 1000, "vip", None
    # Act
    result = calculate_discount(total, tier, code)
    # Assert
    assert result == 150


def test_promo_overrides_member():
    """member + โค้ด PROMO88 (8 ตัว) → ได้ 20% = 200 (ไม่ใช่ 10% = 100)"""
    assert calculate_discount(1000, "member", "PROMO88") == 200


# ── EDGE CASE / BOUNDARY (2) ──────────────────────────────────

def test_boundary_promo_len_5_ignored():
    """โค้ด 5 ตัว < PROMO_MIN_LEN (6) → ถูกมองข้าม → member ได้ 10% = 100"""
    assert calculate_discount(1000, "member", "ABCDE") == 100


def test_zero_total_is_free():
    """ยอด 0 บาท → ส่วนลด 0 ไม่ติดลบ ไม่ crash"""
    assert calculate_discount(0, "vip", "PROMO88") == 0


# ── ERROR CASE (2) ────────────────────────────────────────────

def test_short_promo_code_raises():
    """โค้ดสั้นเกินไป (2 ตัว) → validate_promo_code ต้อง raise ValueError"""
    with pytest.raises(ValueError):
        validate_promo_code("AB")


def test_promo_code_with_symbol_raises():
    """โค้ดมีอักขระพิเศษ → ต้อง raise ValueError"""
    with pytest.raises(ValueError):
        validate_promo_code("AB-CDE")


# ── ฟังก์ชันที่สอง: ยอดสุทธิ (1) ─────────────────────────────

def test_payable_after_discount():
    """ยอดสุทธิของ VIP 1000 = 850 (= 1000 - ส่วนลด 150)"""
    assert calculate_payable(1000, "vip", None) == 850


# 💡 โบนัส: ตรวจว่าโค้ดที่ถูกต้องถูก normalize เป็นตัวพิมพ์ใหญ่
def test_valid_promo_code_is_uppercased():
    assert validate_promo_code("save20") == "SAVE20"