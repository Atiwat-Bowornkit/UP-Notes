import type { Role } from "@prisma/client";
import authHelper from "@/src/utils/authHelper";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export type SessionUser = {
  id: string;
  email: string;
  role: Role;
};

/**
 * Current logged-in user from the Supabase session, matched to our User table by email.
 * If the Supabase account has no User row yet (e.g. registration was interrupted after the
 * Supabase user was created), the row is created here so the user is never locked out.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const authUser = data.user;
  const email = authUser?.email?.toLowerCase();
  if (!authUser || !email) return null;

  const select = { id: true, email: true, role: true } as const;
  const existing = await prisma.user.findUnique({ where: { email }, select });
  if (existing) return existing;

  // Only university addresses may get an account row.
  if (!authHelper.validateUpEmail(email)) return null;

  const rawName = authUser.user_metadata?.name;
  const name = typeof rawName === "string" && rawName.trim() ? rawName.trim() : null;

  return prisma.user.upsert({
    where: { email },
    create: { id: authUser.id, email, name },
    update: {},
    select,
  });
}
