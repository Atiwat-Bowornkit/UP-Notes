import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { NOTES_BUCKET } from '@/lib/constants';
import { removeOrphanFiles } from '@/src/utils/orphanFiles';

export const dynamic = 'force-dynamic';

function hasValidCronSecret(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // never accept an empty/missing secret
  const given = req.headers.get('authorization') ?? '';
  const expected = `Bearer ${secret}`;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Deletes files in Storage that no note references (abandoned uploads), older than 1 hour.
 * Called daily by Vercel Cron (it sends `Authorization: Bearer $CRON_SECRET`); an admin can also
 * call it from a logged-in browser. `?dryRun=1` only reports what would be removed.
 */
export async function GET(req) {
  const isCron = hasValidCronSecret(req);
  if (!isCron) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const dryRun = new URL(req.url).searchParams.get('dryRun') === '1';
    const result = await removeOrphanFiles({
      storage: createAdminClient().storage.from(NOTES_BUCKET),
      prisma,
      dryRun,
    });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('[cleanup-orphans] failed:', error);
    return NextResponse.json({ error: 'ล้างไฟล์ค้างไม่สำเร็จ' }, { status: 500 });
  }
}
