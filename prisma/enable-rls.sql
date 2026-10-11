-- Enable Row Level Security on every app table (run once in Supabase SQL Editor).
--
-- Why: the anon key ships to the browser. With RLS off, anyone holding it can read or
-- modify every row through Supabase's REST API (/rest/v1/...).
--
-- Why this is safe for the app: all database access goes through Prisma using the
-- `postgres` role, which bypasses RLS (rolbypassrls = true). The browser only uses the
-- Supabase client for Auth. No policies are added on purpose, so the REST API exposes nothing.
--
-- Verified on a local Supabase stack: with RLS on, an anon REST read of "User" returns []
-- while Prisma still reads normally.
--
-- Idempotent: enabling RLS twice is a no-op.

ALTER TABLE "public"."User"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Note"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Like"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Report" ENABLE ROW LEVEL SECURITY;

-- Check (all four rows should show rls_enabled = true):
-- select relname, relrowsecurity as rls_enabled from pg_class
-- where relnamespace = 'public'::regnamespace and relname in ('User','Note','Like','Report');
