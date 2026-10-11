import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { NOTES_BUCKET } from '@/lib/constants';
import { validateNoteFields } from '@/src/utils/noteInputHelper';

// ตรวจสิทธิ์: เจ้าของโน้ตเท่านั้นที่จัดการได้
async function verifyOwnership(noteId, userId) {
  const note = await prisma.note.findUnique({ where: { id: noteId } });

  if (!note) {
    return { error: 'Not Found', status: 404 };
  }
  if (note.authorId !== userId) {
    return { error: '403 Forbidden: คุณไม่มีสิทธิ์จัดการโน้ตรายการนี้', status: 403 };
  }
  return { note, error: null };
}

// 1. ลบโน้ต (ลบทั้งไฟล์ใน Storage และแถวใน Database)
export async function DELETE(req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { note, error, status } = await verifyOwnership(params.id, user.id);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    // ลบไฟล์ก่อน ถ้าล้มเหลวให้หยุด จะได้ไม่เหลือแถว DB ที่ไม่มีไฟล์
    if (note.filePath) {
      const { error: storageError } = await createAdminClient()
        .storage.from(NOTES_BUCKET)
        .remove([note.filePath]);
      if (storageError) {
        console.error('[delete note] storage remove failed:', storageError);
        return NextResponse.json({ error: 'ลบไฟล์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' }, { status: 500 });
      }
    }

    await prisma.note.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[delete note] failed:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' }, { status: 500 });
  }
}

// 2. แก้ไขข้อมูลโน้ต (ชื่อเรื่อง, คำอธิบาย, หมวดหมู่)
export async function PUT(req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error, status } = await verifyOwnership(params.id, user.id);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'รูปแบบข้อมูลไม่ถูกต้อง' }, { status: 400 });
    }

    const fields = validateNoteFields(body, { requireCourseCode: false });
    if (!fields.valid) {
      return NextResponse.json({ error: fields.error }, { status: 400 });
    }

    const updatedNote = await prisma.note.update({
      where: { id: params.id },
      data: fields.data,
    });

    return NextResponse.json({ success: true, note: updatedNote });
  } catch (error) {
    console.error('[update note] failed:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' }, { status: 500 });
  }
}
