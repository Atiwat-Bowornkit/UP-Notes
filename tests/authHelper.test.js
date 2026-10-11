const test = require("node:test");
const assert = require("node:assert/strict");
const { validateUpEmail, validatePassword } = require("../src/utils/authHelper");

test("รับเฉพาะอีเมลโดเมน up.ac.th แบบตรงตัวและไม่สนตัวพิมพ์", () => {
  assert.equal(validateUpEmail("A@UP.AC.TH"), true);
  assert.equal(validateUpEmail("x@up.ac.th.evil.com"), false);
  assert.equal(validateUpEmail("x@other.ac.th"), false);
});

test("ตรวจความยาวและชนิดอักขระของรหัสผ่าน", () => {
  assert.ok(validatePassword("Aa1aaaa").some((message) => message.includes("8")));
  assert.deepEqual(validatePassword("Aa1aaaaa"), []);
  assert.equal(validatePassword("abcdefgh").length, 2);
  assert.equal(validatePassword("ABCDEFG1").length, 2);
  assert.equal(validatePassword("Abcdefgh").length, 1);
});