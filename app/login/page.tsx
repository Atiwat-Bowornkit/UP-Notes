"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/AuthShell";

function safeNext(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/notes";
}

function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const confirmationFailed = searchParams.get("error") === "confirmation";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    const supabase = createClient();

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(
        authError.code === "email_not_confirmed"
          ? "กรุณาตรวจกล่องจดหมายและยืนยันอีเมลก่อนเข้าสู่ระบบ"
          : "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      );
      setSubmitting(false);
      return;
    }

    window.location.assign(safeNext(searchParams.get("next")));
  }

  return (
    <AuthShell
      title="เข้าสู่ระบบ"
      subtitle="ยินดีต้อนรับกลับ เข้าสู่ระบบเพื่ออัปโหลดและจัดการโน้ตของคุณ"
      footer={
        <>
          ยังไม่มีบัญชี?{" "}
          <Link href="/register" className="font-medium text-accent-soft hover:text-white">
            สมัครสมาชิก
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="email" className="label">อีเมล</label>
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
            autoComplete="current-password"
            placeholder="••••••••"
            className="input"
          />
        </div>

        {confirmationFailed && !error && (
          <p role="status" className="alert-warning">
            ลิงก์ยืนยันอีเมลใช้ไม่ได้ในเบราว์เซอร์นี้หรือหมดอายุ หากเคยกดยืนยันแล้ว ให้เข้าสู่ระบบได้เลย
          </p>
        )}
        {error && <p role="alert" className="alert-error">{error}</p>}

        <button className="btn-primary w-full" type="submit" disabled={submitting}>
          {submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  // useSearchParams needs a Suspense boundary for static rendering
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
