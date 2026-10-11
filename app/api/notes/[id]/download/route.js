import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { NOTES_BUCKET } from '@/lib/constants';

// Returns a short-lived signed URL for a published note and counts the download.
export async function POST(req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const note = await prisma.note.findFirst({
      where: { id: params.id, status: 'PUBLISHED' },
      select: { filePath: true, fileName: true },
    });
    if (!note) return NextResponse.json({ error: 'Not Found' }, { status: 404 });

    const { data, error } = await createAdminClient()
      .storage.from(NOTES_BUCKET)
      .createSignedUrl(note.filePath, 60, { download: note.fileName });
    if (error || !data?.signedUrl) {
      console.error('[download] signed url failed:', error);
      return NextResponse.json({ error: 'ไม่สามารถสร้างลิงก์ดาวน์โหลดได้' }, { status: 500 });
    }

    // Count only after the link was created successfully.
    await prisma.note.update({
      where: { id: params.id },
      data: { downloadCount: { increment: 1 } },
    });

    return NextResponse.json({ downloadUrl: data.signedUrl, fileName: note.fileName });
  } catch (error) {
    console.error('[download] failed:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' }, { status: 500 });
  }
}
