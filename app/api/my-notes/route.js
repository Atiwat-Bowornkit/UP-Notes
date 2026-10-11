import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: กรุณาล็อกอิน' }, { status: 401 });
    }

    // ดึงเฉพาะโน้ตของตนเอง (authorId === user.id) ตามโจทย์ US-07
    const rows = await prisma.note.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { likes: true } } },
    });

    // Flatten the counters the page displays (it expects likesCount / downloadsCount)
    const notes = rows.map(({ _count, ...note }) => ({
      ...note,
      likesCount: _count.likes,
      downloadsCount: note.downloadCount,
    }));

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('[my-notes] failed:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' }, { status: 500 });
  }
}
