"use server";

import { revalidatePath } from "next/cache";
import { NoteStatus } from "@prisma/client";
import { NOTES_BUCKET } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin, shouldHideNote, validateReport } from "@/src/utils/reportHelper";

export type ActionState = { ok: boolean; message: string };

const NOT_ADMIN: ActionState = {
  ok: false,
  message: "403 Forbidden: คุณไม่มีสิทธิ์จัดการรายงาน",
};

/** US-09: any logged-in user reports a note. Hides it after more than 3 open reports. */
export async function submitReport(
  noteId: string,
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, message: "กรุณาเข้าสู่ระบบก่อนรายงานปัญหา" };
  }

  const checked = validateReport({
    reason: formData.get("reason"),
    detail: formData.get("detail"),
  });
  if (!checked.isValid) {
    return { ok: false, message: checked.error };
  }

  const note = await prisma.note.findUnique({
    where: { id: noteId },
    select: { id: true },
  });
  if (!note) {
    return { ok: false, message: "ไม่พบโน้ตย่อที่ต้องการรายงาน" };
  }

  await prisma.$transaction(async (tx) => {
    // One report per user per note; reporting again re-opens an old dismissed report.
    await tx.report.upsert({
      where: { noteId_reporterId: { noteId, reporterId: user.id } },
      create: {
        noteId,
        reporterId: user.id,
        reason: checked.reason,
        detail: checked.detail,
      },
      update: { reason: checked.reason, detail: checked.detail, resolved: false },
    });

    const openReports = await tx.report.count({
      where: { noteId, resolved: false },
    });
    if (shouldHideNote(openReports)) {
      await tx.note.update({
        where: { id: noteId },
        data: { status: NoteStatus.PENDING_REVIEW },
      });
    }
  });

  revalidatePath("/admin/reports");
  return { ok: true, message: "ขอบคุณที่แจ้งปัญหา ทีมงานจะตรวจสอบโดยเร็ว" };
}

/** US-10 AC2: admin deletes the note (file in Storage + row in DB). */
export async function deleteReportedNote(noteId: string): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!isAdmin(user)) return NOT_ADMIN;

  const note = await prisma.note.findUnique({
    where: { id: noteId },
    select: { filePath: true },
  });
  if (!note) {
    return { ok: false, message: "ไม่พบโน้ตย่อนี้แล้ว" };
  }

  // Remove the file first so a failure never leaves an orphan file without a DB row.
  const { error } = await createAdminClient()
    .storage.from(NOTES_BUCKET)
    .remove([note.filePath]);
  if (error) {
    return { ok: false, message: "ลบไฟล์จาก Storage ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" };
  }

  await prisma.note.delete({ where: { id: noteId } });

  revalidatePath("/admin/reports");
  return { ok: true, message: "ลบโน้ตย่อเรียบร้อยแล้ว" };
}

/** US-10 AC3: admin dismisses false reports and the note becomes visible again. */
export async function dismissReports(noteId: string): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!isAdmin(user)) return NOT_ADMIN;

  const note = await prisma.note.findUnique({
    where: { id: noteId },
    select: { id: true },
  });
  if (!note) {
    return { ok: false, message: "ไม่พบโน้ตย่อนี้แล้ว" };
  }

  await prisma.$transaction([
    prisma.report.updateMany({
      where: { noteId, resolved: false },
      data: { resolved: true },
    }),
    prisma.note.update({
      where: { id: noteId },
      data: { status: NoteStatus.PUBLISHED },
    }),
  ]);

  revalidatePath("/admin/reports");
  return { ok: true, message: "ยกเลิกรายงานแล้ว โน้ตย่อกลับมาแสดงตามปกติ" };
}
