-- Adds the faculty / program columns used by the note filters.
-- Run once in the Supabase SQL Editor BEFORE deploying the code that reads them
-- (Prisma selects every column, so /notes would fail without them).
-- Idempotent and non-destructive: existing notes keep NULL (shown as "no faculty").
-- Equivalent to `npm run db:push`.

ALTER TABLE "public"."Note" ADD COLUMN IF NOT EXISTS "faculty" TEXT;
ALTER TABLE "public"."Note" ADD COLUMN IF NOT EXISTS "program" TEXT;
CREATE INDEX IF NOT EXISTS "Note_faculty_program_idx" ON "public"."Note" ("faculty", "program");
