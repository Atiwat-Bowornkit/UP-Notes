import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export type SessionUser = {
  id: string;
  email: string;
  role: Role;
};

/**
 * Current logged-in user from the Supabase session, matched to our User table by email.
 * Returns null when logged out or when the auth module has not created the User row yet.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email;
  if (!email) return null;

  return prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, role: true },
  });
}
