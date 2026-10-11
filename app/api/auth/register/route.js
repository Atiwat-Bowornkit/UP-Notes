import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import authHelper from "@/src/utils/authHelper";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const normalizedEmail = String(email ?? "").trim().toLowerCase();

    if (!authHelper.validateUpEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: "กรุณาใช้อีเมลมหาวิทยาลัยพะเยาเท่านั้น" },
        { status: 400 },
      );
    }

    const passwordErrors = authHelper.validatePassword(password);
    if (passwordErrors.length) {
      return NextResponse.json({ error: passwordErrors.join(" ") }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: `${new URL(request.url).origin}/auth/callback?next=/notes`,
      },
    });

    if (error) {
      const duplicate =
        error.code === "user_already_exists" ||
        error.message.toLowerCase().includes("already registered");

      return NextResponse.json(
        { error: duplicate ? "อีเมลนี้สมัครแล้ว" : "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่" },
        { status: duplicate ? 409 : 400 },
      );
    }

    if (!data.user) {
      return NextResponse.json({ error: "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่" }, { status: 400 });
    }

    // Supabase อาจตอบกลับผู้ใช้จำลองเมื่ออีเมลซ้ำและไม่เปิดเผยข้อผิดพลาด
    if (data.user.identities?.length === 0) {
      return NextResponse.json({ error: "อีเมลนี้สมัครแล้ว" }, { status: 409 });
    }

    await prisma.user.upsert({
      where: { email: normalizedEmail },
      create: { id: data.user.id, email: normalizedEmail },
      update: {},
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่" }, { status: 500 });
  }
}