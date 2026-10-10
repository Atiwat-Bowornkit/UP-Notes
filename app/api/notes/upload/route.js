import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { NOTES_BUCKET } from '@/lib/constants';
import { validateUploadFile, validateCourseCode, sanitizeFileName } from '@/src/utils/uploadHelper';

const CATEGORIES = ['GE', 'MAJOR_REQUIRED', 'ELECTIVE'];

export async function POST(req) {
  let uploadedFilePath = null;
  const supabase = createClient();

  try {
    // 1. ตรวจสอบสถานะการล็อกอิน (ใช้ id ของตาราง User ใน Prisma ไม่ใช่ id ของ Supabase Auth)
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: กรุณาล็อกอินก่อนทำรายการ' }, { status: 401 });
    }

    const formData = await req.formData();
    const title = String(formData.get('title') ?? '').trim();
    const courseCode = String(formData.get('courseCode') ?? '').trim();
    const category = String(formData.get('category') ?? '');
    const description = String(formData.get('description') ?? '').trim();
    const file = formData.get('file');

    // 2. ตรวจซ้ำที่ server (ห้ามเชื่อ client อย่างเดียว)
    if (!title) {
      return NextResponse.json({ error: 'กรุณากรอกชื่อเรื่อง' }, { status: 400 });
    }
    if (!validateCourseCode(courseCode)) {
      return NextResponse.json({ error: 'รหัสวิชาต้องเป็นตัวเลข 6 หลัก' }, { status: 400 });
    }
    if (!CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'หมวดหมู่ไม่ถูกต้อง' }, { status: 400 });
    }
    const validation = validateUploadFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 3. path: userId/uuid-ชื่อไฟล์
    const cleanName = sanitizeFileName(file.name);
    const fileKey = `${user.id}/${randomUUID()}-${cleanName}`;
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
        title,
        courseCode,
        category,
        description: description || null,
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
