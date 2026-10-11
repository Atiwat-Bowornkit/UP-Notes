"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function safeNext(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/notes";
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

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
      return;
    }

    window.location.assign(safeNext(searchParams.get("next")));
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold">เข้าสู่ระบบ</h1>
      <form onSubmit={submit} className="space-y-4">
        <input name="email" type="email" required placeholder="อีเมล" className="w-full rounded bg-white p-3 text-gray-900 caret-gray-900 placeholder:text-gray-500"
/>
        <input name="password" type="password" required placeholder="รหัสผ่าน" className="w-full rounded bg-white p-3 text-gray-900 caret-gray-900 placeholder:text-gray-500"
/>
        {error && <p role="alert" className="text-red-500">{error}</p>}
        <button className="btn-primary w-full" type="submit">เข้าสู่ระบบ</button>
      </form>
      <p className="mt-4"><Link href="/register">สมัครสมาชิก</Link></p>
    </main>
  );
}