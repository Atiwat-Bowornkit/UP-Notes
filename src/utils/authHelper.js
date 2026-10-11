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

const USERNAME_MIN_LENGTH = 2;
const USERNAME_MAX_LENGTH = 30;

/**
 * Validate the display name shown in the navbar and on notes.
 * @returns {{valid: true, name: string} | {valid: false, error: string}}
 */
function validateUsername(username) {
  const name = String(username ?? "").trim().replace(/\s+/g, " ");

  if (name.length < USERNAME_MIN_LENGTH || name.length > USERNAME_MAX_LENGTH) {
    return {
      valid: false,
      error: `ชื่อผู้ใช้ต้องมี ${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH} ตัวอักษร`,
    };
  }

  return { valid: true, name };
}

/**
 * Name shown publicly for a user. Falls back to the part of the email before "@"
 * (never the full address) for accounts created before usernames existed.
 */
function displayName(user) {
  const name = typeof user?.name === "string" ? user.name.trim() : "";
  if (name) return name;
  const local = typeof user?.email === "string" ? user.email.split("@")[0] : "";
  return local || "ไม่ระบุชื่อ";
}

module.exports = { validateUpEmail, validatePassword, validateUsername, displayName };