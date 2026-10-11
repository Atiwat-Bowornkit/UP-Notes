import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

    // No confirmation email: the account is created already-confirmed via the admin API.
    // Access is still limited to @up.ac.th addresses (validated above).
    const { data, error } = await createAdminClient().auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
    });

    if (error) {
      const duplicate =
        error.code === "email_exists" ||
        error.code === "user_already_exists" ||
        error.message.toLowerCase().includes("already been registered");

      return NextResponse.json(
        { error: duplicate ? "อีเมลนี้สมัครแล้ว" : "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่" },
        { status: duplicate ? 409 : 400 },
      );
    }

    if (!data.user) {
      return NextResponse.json({ error: "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่" }, { status: 400 });
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