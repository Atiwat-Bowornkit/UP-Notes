import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const supabase = createClient();

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: กรุณาล็อกอิน' }, { status: 401 });
    }

    // ดึงเฉพาะโน้ตของตนเอง (authorId === user.id) ตามโจทย์ US-07
    const notes = await prisma.note.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}