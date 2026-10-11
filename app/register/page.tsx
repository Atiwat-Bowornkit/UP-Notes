"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import authHelper from "@/src/utils/authHelper";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
  }

  if (success) {
    return (
      <main className="mx-auto max-w-md space-y-4 p-6">
        <p role="status">สมัครสมาชิกสำเร็จ สามารถเข้าสู่ระบบได้ทันที</p>
        <Link href="/login" className="btn-primary inline-block">เข้าสู่ระบบ</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold">สมัครสมาชิก</h1>
      <form onSubmit={submit} className="space-y-4">
        <input name="username" type="text" required maxLength={30} autoComplete="nickname" placeholder="ชื่อผู้ใช้" className="w-full rounded bg-white p-3 text-gray-900 caret-gray-900 placeholder:text-gray-500"
/>
        <input name="email" type="email" required placeholder="อีเมล" className="w-full rounded bg-white p-3 text-gray-900 caret-gray-900 placeholder:text-gray-500"
/>
        <input name="password" type="password" required placeholder="รหัสผ่าน" className="w-full rounded bg-white p-3 text-gray-900 caret-gray-900 placeholder:text-gray-500"
/>
        <input name="confirmPassword" type="password" required placeholder="ยืนยันรหัสผ่าน" className="w-full rounded bg-white p-3 text-gray-900 caret-gray-900 placeholder:text-gray-500"
/>
        {error && <p role="alert" className="text-red-500">{error}</p>}
        <button className="btn-primary w-full" type="submit">สมัครสมาชิก</button>
      </form>
      <p className="mt-4">
        <Link href="/login">มีบัญชีแล้ว? เข้าสู่ระบบ</Link>
      </p>
    </main>
  );
}