import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { NOTES_BUCKET } from '@/lib/constants';
import { MAX_FILE_SIZE, ALLOWED_MIME_TYPES, sanitizeFileName } from '@/src/utils/uploadHelper';
import { validateNoteFields } from '@/src/utils/noteInputHelper';

/**
 * Step 2 of an upload: the browser has put the file in Storage; verify it really is there (size and
 * type are read from Storage, never trusted from the client) and create the Note row.
 */
export async function POST(req) {
  const storage = createAdminClient().storage.from(NOTES_BUCKET);
  let path = null;
  let verified = false;

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: กรุณาล็อกอินก่อนทำรายการ' }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'รูปแบบข้อมูลไม่ถูกต้อง' }, { status: 400 });
    }

    const fields = validateNoteFields(body, { requireFaculty: true });
    if (!fields.valid) {
      return NextResponse.json({ error: fields.error }, { status: 400 });
    }

    // The path must be one this user was issued by /upload/init: <userId>/<uuid>.<ext>
    path = typeof body.path === 'string' ? body.path : '';
    const shape = /^([0-9a-f-]{36})\/([0-9a-f-]{36}\.(pdf|png|jpe?g))$/i.exec(path);
    if (!shape || shape[1] !== user.id) {
      path = null; // not ours: never touch it
      return NextResponse.json({ error: 'ข้อมูลไฟล์ไม่ถูกต้อง' }, { status: 400 });
    }
    const objectName = shape[2];

    const { data: objects, error: listError } = await storage.list(user.id, { search: objectName, limit: 10 });
    if (listError) throw listError;
    const object = (objects ?? []).find((o) => o.name === objectName);
    if (!object) {
      path = null;
      return NextResponse.json({ error: 'ไม่พบไฟล์ที่อัปโหลด กรุณาลองใหม่อีกครั้ง' }, { status: 400 });
    }
    verified = true;

    const size = Number(object.metadata?.size);
    const mimeType = String(object.metadata?.mimetype ?? '').toLowerCase();
    if (!Number.isFinite(size) || size <= 0 || size > MAX_FILE_SIZE) {
      await storage.remove([path]);
      return NextResponse.json({ error: 'ขนาดไฟล์ต้องไม่เกิน 10MB' }, { status: 400 });
    }
    if (mimeType && !ALLOWED_MIME_TYPES.includes(mimeType)) {
      await storage.remove([path]);
      return NextResponse.json({ error: 'รองรับเฉพาะไฟล์ PDF, PNG, JPG เท่านั้น' }, { status: 400 });
    }

    if (await prisma.note.findFirst({ where: { filePath: path }, select: { id: true } })) {
      return NextResponse.json({ error: 'ไฟล์นี้ถูกใช้สร้างโน้ตไปแล้ว' }, { status: 409 });
    }

    const originalName = typeof body.fileName === 'string' ? body.fileName : objectName;
    const note = await prisma.note.create({
      data: {
        ...fields.data,
        filePath: path,
        fileName: sanitizeFileName(originalName) || objectName,
        fileSizeBytes: Math.round(size),
        authorId: user.id,
        status: 'PENDING_REVIEW',
      },
    });

    return NextResponse.json({ success: true, note });
  } catch (error) {
    // Rollback: do not leave a file without a row behind
    if (path && verified) {
      await storage.remove([path]).catch(() => {});
    }
    console.error('[upload complete] failed:', error);
    return NextResponse.json({ error: 'อัปโหลดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' }, { status: 500 });
  }
}
