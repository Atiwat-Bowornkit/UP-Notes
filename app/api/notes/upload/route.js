import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { NOTES_BUCKET } from '@/lib/constants';
import { validateUploadFile, sanitizeFileName } from '@/src/utils/uploadHelper';
import { validateNoteFields } from '@/src/utils/noteInputHelper';

export async function POST(req) {
  let uploadedFilePath = null;
  // Storage writes go through the service role after the user is authenticated above,
  // so uploads do not depend on per-user Storage RLS policies.
  const supabase = createAdminClient();

  try {
    // 1. ตรวจสอบสถานะการล็อกอิน (ใช้ id ของตาราง User ใน Prisma ไม่ใช่ id ของ Supabase Auth)
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: กรุณาล็อกอินก่อนทำรายการ' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');

    // 2. ตรวจซ้ำที่ server (ห้ามเชื่อ client อย่างเดียว)
    const fields = validateNoteFields({
      title: formData.get('title'),
      courseCode: formData.get('courseCode'),
      category: formData.get('category'),
      description: formData.get('description'),
    });
    if (!fields.valid) {
      return NextResponse.json({ error: fields.error }, { status: 400 });
    }
    const validation = validateUploadFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 3. path: userId/uuid.ext — Storage keys must be ASCII, so Thai file names live in the DB only
    const cleanName = sanitizeFileName(file.name);
    const ext = (file.name.slice(file.name.lastIndexOf('.')) || '').toLowerCase();
    const fileKey = `${user.id}/${randomUUID()}${ext}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // 4. อัปโหลดไป bucket บน Supabase Storage
    const { error: storageError } = await supabase.storage
      .from(NOTES_BUCKET)
      .upload(fileKey, fileBuffer, { contentType: file.type });

    if (storageError) {
      throw new Error(`Storage Upload Failed: ${storageError.message}`);
    }
    uploadedFilePath = fileKey; // เผื่อต้อง rollback

    // 5. สร้างแถว Note (ตาม schema: filePath, fileName, fileSizeBytes)
    const note = await prisma.note.create({
      data: {
        ...fields.data,
        filePath: fileKey,
        fileName: cleanName,
        fileSizeBytes: file.size,
        authorId: user.id,
        status: 'PENDING_REVIEW',
      },
    });

    return NextResponse.json({ success: true, note });
  } catch (error) {
    // 6. Rollback: ลบไฟล์ที่เพิ่งอัปโหลดถ้าสร้างแถวใน DB ไม่สำเร็จ
    if (uploadedFilePath) {
      await supabase.storage.from(NOTES_BUCKET).remove([uploadedFilePath]);
    }
    console.error('[upload] failed:', error);
    return NextResponse.json({ error: 'อัปโหลดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' }, { status: 500 });
  }
}
