import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { NOTES_BUCKET } from '@/lib/constants';

const CATEGORIES = ['GE', 'MAJOR_REQUIRED', 'ELECTIVE'];

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
      const { error: storageError } = await createClient()
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

    const title = typeof body?.title === 'string' ? body.title.trim() : '';
    if (!title) {
      return NextResponse.json({ error: 'กรุณากรอกชื่อเรื่อง' }, { status: 400 });
    }
    if (!CATEGORIES.includes(body.category)) {
      return NextResponse.json({ error: 'หมวดหมู่ไม่ถูกต้อง' }, { status: 400 });
    }
    const description = typeof body.description === 'string' ? body.description.trim() : '';

    const updatedNote = await prisma.note.update({
      where: { id: params.id },
      data: { title, description: description || null, category: body.category },
    });

    return NextResponse.json({ success: true, note: updatedNote });
  } catch (error) {
    console.error('[update note] failed:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' }, { status: 500 });
  }
}
