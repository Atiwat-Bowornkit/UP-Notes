import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

// ฟังก์ชันตรวจสอบสิทธิ์: เช็ก note.authorId === user.id
async function verifyOwnership(noteId, userId) {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
  });

  if (!note) {
    return { error: 'Not Found', status: 404 };
  }

  // ถ้าไม่ใช่เจ้าของให้ส่ง 403 Forbidden กลับไปทันที
  if (note.authorId !== userId) {
    return { error: '403 Forbidden: คุณไม่มีสิทธิ์จัดการโน้ตรายการนี้', status: 403 };
  }

  return { note, error: null };
}

// 1. ลบโน้ต (ลบทั้งไฟล์ใน Storage และแถวใน Database)
export async function DELETE(req, { params }) {
  const supabase = createClient();

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { note, error, status } = await verifyOwnership(params.id, user.id);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    // ลบไฟล์ออกจาก Supabase Storage
    if (note.filePath) {
      await supabase.storage.from('notes').remove([note.filePath]);
    }

    // ลบข้อมูลโน้ตออกจากฐานข้อมูล
    await prisma.note.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. แก้ไขข้อมูลโน้ต (ชื่อเรื่อง, คำอธิบาย, หมวดหมู่)
export async function PUT(req, { params }) {
  const supabase = createClient();

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error, status } = await verifyOwnership(params.id, user.id);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    const body = await req.json();

    const updatedNote = await prisma.note.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
      },
    });

    return NextResponse.json({ success: true, note: updatedNote });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}