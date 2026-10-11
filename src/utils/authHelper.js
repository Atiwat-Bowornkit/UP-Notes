"use strict";

const PASSWORD_RULES = [
  { test: (value) => value.length >= 8, message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" },
  { test: (value) => /[A-Z]/.test(value), message: "รหัสผ่านต้องมีตัวพิมพ์ใหญ่" },
  { test: (value) => /[a-z]/.test(value), message: "รหัสผ่านต้องมีตัวพิมพ์เล็ก" },
  { test: (value) => /[0-9]/.test(value), message: "รหัสผ่านต้องมีตัวเลข" },
];

function validateUpEmail(email) {
  const normalized = String(email ?? "").trim().toLowerCase();
  const parts = normalized.split("@");

  return parts.length === 2 && parts[0].length > 0 && parts[1] === "up.ac.th";
}

function validatePassword(password) {
  const value = String(password ?? "");
  return PASSWORD_RULES.filter((rule) => !rule.test(value)).map((rule) => rule.message);
}

module.exports = { validateUpEmail, validatePassword };