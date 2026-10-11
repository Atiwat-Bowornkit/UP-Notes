"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import authHelper from "@/src/utils/authHelper";
import AuthShell from "@/components/AuthShell";
import { CheckIcon } from "@/components/Icons";

// Each rule is matched against the messages returned by authHelper.validatePassword,
// so the checklist can never disagree with the real validation.
const PASSWORD_CHECKS = [
  { key: "8", label: "อย่างน้อย 8 ตัวอักษร" },
  { key: "ตัวพิมพ์ใหญ่", label: "มีตัวพิมพ์ใหญ่ (A-Z)" },
  { key: "ตัวพิมพ์เล็ก", label: "มีตัวพิมพ์เล็ก (a-z)" },
  { key: "ตัวเลข", label: "มีตัวเลข (0-9)" },
];

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [password, setPassword] = useState("");

  const failedRules = authHelper.validatePassword(password);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);
    const username = String(form.get("username") ?? "");
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    const usernameCheck = authHelper.validateUsername(username);
    if (!usernameCheck.valid) {
      setError(usernameCheck.error);
      return;
    }

    if (!authHelper.validateUpEmail(email)) {
      setError("กรุณาใช้อีเมลมหาวิทยาลัยพะเยาเท่านั้น");
      return;
    }

    const passwordErrors = authHelper.validatePassword(password);
    if (passwordErrors.length) {
      setError(passwordErrors.join(" "));
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านสองช่องไม่ตรงกัน");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "สมัครสมาชิกไม่สำเร็จ");
        return;
      }

      setSuccess(true);
    } catch {
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <AuthShell
        title="สมัครสมาชิกสำเร็จ"
        subtitle="บัญชีของคุณพร้อมใช้งานแล้ว"
        footer={<Link href="/notes" className="hover:text-white">เริ่มดูโน้ตก่อนก็ได้</Link>}
      >
        <div className="flex flex-col items-center gap-5 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-success/15 text-success">
            <CheckIcon size={28} />
          </span>
          <p role="status" className="text-sm text-gray-300">
            สามารถเข้าสู่ระบบได้ทันที ไม่ต้องยืนยันอีเมล
          </p>
          <Link href="/login" className="btn-primary w-full">เข้าสู่ระบบ</Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="สมัครสมาชิก"
      subtitle="ใช้อีเมลมหาวิทยาลัยพะเยา (@up.ac.th) เพื่อเริ่มแบ่งปันโน้ต"
      footer={
        <>
          มีบัญชีแล้ว?{" "}
          <Link href="/login" className="font-medium text-accent-soft hover:text-white">
            เข้าสู่ระบบ
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="username" className="label">ชื่อผู้ใช้</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            maxLength={30}
            autoComplete="nickname"
            placeholder="ชื่อที่แสดงบนโน้ตของคุณ"
            className="input"
          />
          <p className="hint">2–30 ตัวอักษร</p>
        </div>

        <div>
          <label htmlFor="email" className="label">อีเมลมหาวิทยาลัย</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="รหัสนิสิต@up.ac.th"
            className="input"
          />
        </div>

        <div>
          <label htmlFor="password" className="label">รหัสผ่าน</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ul className="mt-2 grid grid-cols-1 gap-1 text-xs sm:grid-cols-2" aria-label="เงื่อนไขรหัสผ่าน">
            {PASSWORD_CHECKS.map((rule) => {
              const ok = password.length > 0 && !failedRules.some((m) => m.includes(rule.key));
              return (
                <li key={rule.key} className={`flex items-center gap-1.5 ${ok ? "text-emerald-300" : "text-gray-400"}`}>
                  <span
                    className={`grid h-4 w-4 place-items-center rounded-full border ${
                      ok ? "border-success bg-success/20" : "border-white/20"
                    }`}
                    aria-hidden="true"
                  >
                    {ok && <CheckIcon size={11} />}
                  </span>
                  {rule.label}
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="label">ยืนยันรหัสผ่าน</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            placeholder="พิมพ์รหัสผ่านอีกครั้ง"
            className="input"
          />
        </div>

        {error && <p role="alert" className="alert-error">{error}</p>}

        <button className="btn-primary w-full" type="submit" disabled={submitting}>
          {submitting ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
        </button>
      </form>
    </AuthShell>
  );
}
