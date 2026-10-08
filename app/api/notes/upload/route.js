import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { validateUploadFile, sanitizeFileName } from '@/src/utils/uploadHelper';

export async function POST(req) {
  let uploadedFilePath = null;
  const supabase = createClient();

  try {
    // 1. ตรวจสอบสถานะการล็อกอิน
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: กรุณาล็อกอินก่อนทำรายการ' }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get('title');
    const courseCode = formData.get('courseCode');
    const category = formData.get('category');
    const description = formData.get('description');
    const file = formData.get('file');

    // 2. ตรวจซ้ำที่ server ด้วย validateUploadFile (ห้ามเชื่อ client อย่างเดียว)
    const validation = validateUploadFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 3. จัดการชื่อไฟล์ และสร้าง path: userId/uuid-ชื่อไฟล์
    const cleanName = sanitizeFileName(file.name);
    const fileKey = `${user.id}/${uuidv4()}-${cleanName}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // 4. อัปโหลดไป bucket 'notes' บน Supabase Storage
    const { error: storageError } = await supabase.storage
      .from('notes')
      .upload(fileKey, fileBuffer, {
        contentType: file.type,
      });

    if (storageError) {
      throw new Error(`Storage Upload Failed: ${storageError.message}`);
    }

    uploadedFilePath = fileKey; // บันทึก path ไว้เผื่อต้อง Rollback ลบทิ้ง

    const { data: { publicUrl } } = supabase.storage.from('notes').getPublicUrl(fileKey);

    // 5. สร้างแถว Note ใน Database ผ่าน Prisma
    const note = await prisma.note.create({
      data: {
        title,
        courseCode,
        category,
        description,
        fileUrl: publicUrl,
        filePath: fileKey,
        authorId: user.id,
        status: 'PENDING_REVIEW',
      },
    });

    return NextResponse.json({ success: true, note });
  } catch (error) {
    // 6. Rollback: ถ้าสร้างแถวใน DB ไม่สำเร็จ ให้ลบไฟล์ที่เพิ่งอัปโหลดทิ้งทันที
    if (uploadedFilePath) {
      await supabase.storage.from('notes').remove([uploadedFilePath]);
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}