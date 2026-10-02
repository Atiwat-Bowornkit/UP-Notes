"""Campus Eats — pricing business logic (Lab12B Solution / เฉลย)

Semantics (เหมือน Lab09 sample):
  - calculate_discount  → คืน "จำนวนส่วนลด" (บาท)
  - calculate_payable   → คืน "ยอดที่ต้องจ่ายจริง" (บาท)
"""

VIP_RATE = 0.15
MEMBER_RATE = 0.10
PROMO_RATE = 0.20
PROMO_MIN_LEN = 6


def calculate_discount(total: int, tier: str, promo_code: str | None) -> int:
    """คืนจำนวนส่วนลด (บาท)

    - tier: "vip" = 15%, "member" = 10%, อื่นๆ = 0%
    - promo_code ยาว >= PROMO_MIN_LEN → 20% (ใช้เรตที่มากกว่าระหว่าง tier กับ promo)
    """
    rate = {"vip": VIP_RATE, "member": MEMBER_RATE}.get(tier, 0.0)
    if promo_code and len(promo_code) >= PROMO_MIN_LEN:
        rate = max(rate, PROMO_RATE)
    return int(total * rate)


def calculate_payable(total: int, tier: str, promo_code: str | None) -> int:
    """คืนยอดที่ต้องจ่ายจริง = total - ส่วนลด"""
    return total - calculate_discount(total, tier, promo_code)


def validate_promo_code(code: str) -> str:
    """ตรวจรูปแบบโค้ดส่วนลด → คืนโค้ดตัวพิมพ์ใหญ่ หรือ raise ValueError"""
    if not code or len(code) < PROMO_MIN_LEN:
        raise ValueError(f"promo code must be at least {PROMO_MIN_LEN} characters")
    if not code.isalnum():
        raise ValueError("promo code must contain only letters and digits")
    return code.upper()