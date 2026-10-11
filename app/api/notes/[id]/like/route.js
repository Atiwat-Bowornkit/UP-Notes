import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

// Only published notes can be liked (hidden/pending notes are not visible to others).
async function findLikeableNote(id) {
  return prisma.note.findFirst({ where: { id, status: 'PUBLISHED' }, select: { id: true } });
}

async function respond(noteId, userId) {
  const likes = await prisma.like.count({ where: { noteId } });
  return NextResponse.json({ success: true, likes, liked: Boolean(userId) });
}

// Like a note (idempotent: liking twice keeps a single like)
export async function POST(req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!(await findLikeableNote(params.id))) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    await prisma.like.upsert({
      where: { userId_noteId: { userId: user.id, noteId: params.id } },
      create: { userId: user.id, noteId: params.id },
      update: {},
    });
    return respond(params.id, user.id);
  } catch (error) {
    console.error('[like] failed:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' }, { status: 500 });
  }
}

// Remove the current user's like (idempotent)
export async function DELETE(req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.like.deleteMany({ where: { userId: user.id, noteId: params.id } });
    const likes = await prisma.like.count({ where: { noteId: params.id } });
    return NextResponse.json({ success: true, likes, liked: false });
  } catch (error) {
    console.error('[unlike] failed:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' }, { status: 500 });
  }
}
