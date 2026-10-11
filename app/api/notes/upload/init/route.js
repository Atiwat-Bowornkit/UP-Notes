import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentUser } from '@/lib/session';
import { NOTES_BUCKET } from '@/lib/constants';
import { validateUploadFile } from '@/src/utils/uploadHelper';
import { validateNoteFields } from '@/src/utils/noteInputHelper';

/**
 * Step 1 of an upload. Files can be larger than the serverless request limit (Vercel: 4.5 MB),
 * so the browser uploads straight to Supabase Storage. Here we only check who is uploading and
 * what (metadata + file name/size/type) and hand back a one-time signed upload URL.
 */
export async function POST(req) {
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

    const size = Number(body.fileSize);
    if (!Number.isFinite(size) || size <= 0) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลไฟล์' }, { status: 400 });
    }
    const fileName = typeof body.fileName === 'string' ? body.fileName : '';
    const validation = validateUploadFile({ name: fileName, size, type: String(body.fileType ?? '') });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // userId/uuid.ext — Storage keys must be ASCII, the original name is kept in the DB
    const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    const path = `${user.id}/${randomUUID()}${ext}`;

    const { data, error } = await createAdminClient().storage.from(NOTES_BUCKET).createSignedUploadUrl(path);
    if (error || !data?.token) {
      console.error('[upload init] signed upload url failed:', error);
      return NextResponse.json({ error: 'เตรียมการอัปโหลดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' }, { status: 500 });
    }

    return NextResponse.json({ path: data.path ?? path, token: data.token });
  } catch (error) {
    console.error('[upload init] failed:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' }, { status: 500 });
  }
}
