const test = require("node:test");
const assert = require("node:assert/strict");
const { validateUpEmail, validatePassword, validateUsername, displayName } = require("../src/utils/authHelper");

test("รับเฉพาะอีเมลโดเมน up.ac.th แบบตรงตัวและไม่สนตัวพิมพ์", () => {
  assert.equal(validateUpEmail("A@UP.AC.TH"), true);
  assert.equal(validateUpEmail("x@up.ac.th.evil.com"), false);
  assert.equal(validateUpEmail("x@other.ac.th"), false);
});

test("ตรวจความยาวและชนิดอักขระของรหัสผ่าน", () => {
  assert.ok(validatePassword("Aa1aaaa").some((message) => message.includes("8")));
  assert.deepEqual(validatePassword("Aa1aaaaa"), []);
  assert.equal(validatePassword("abcdefgh").length, 2);
  assert.equal(validatePassword("ABCDEFG1").length, 1);
  assert.equal(validatePassword("Abcdefgh").length, 1);
});

test("ชื่อผู้ใช้ต้องยาว 2-30 ตัวอักษร และตัดช่องว่างส่วนเกิน", () => {
  assert.deepEqual(validateUsername("  สมชาย   ใจดี "), { valid: true, name: "สมชาย ใจดี" });
  assert.equal(validateUsername("a").valid, false);
  assert.equal(validateUsername("ab").valid, true);
  assert.equal(validateUsername("a".repeat(30)).valid, true);
  assert.equal(validateUsername("a".repeat(31)).valid, false);
  assert.equal(validateUsername("   ").valid, false);
  assert.equal(validateUsername(undefined).valid, false);
});

test("displayName ใช้ชื่อก่อน ไม่มีชื่อใช้ส่วนหน้า @ ของอีเมล ไม่เปิดเผยอีเมลเต็ม", () => {
  assert.equal(displayName({ name: " สมชาย ", email: "a@up.ac.th" }), "สมชาย");
  assert.equal(displayName({ name: null, email: "67026179@up.ac.th" }), "67026179");
  assert.equal(displayName({ name: "  ", email: "b@up.ac.th" }), "b");
  assert.equal(displayName(null), "ไม่ระบุชื่อ");
  assert.equal(displayName({}), "ไม่ระบุชื่อ");
});
