import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const IDLE_TIMEOUT_MS = 60 * 60 * 1000;
const ACTIVITY_COOKIE = "upnotes_last_activity";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const protectedPath =
    path === "/my-notes" ||
    path.startsWith("/my-notes/") ||
    path === "/notes/upload" ||
    path.startsWith("/admin/") ||
    path === "/admin";

  if (user) {
    const lastActivity = Number(request.cookies.get(ACTIVITY_COOKIE)?.value ?? 0);

    if (lastActivity && Date.now() - lastActivity > IDLE_TIMEOUT_MS) {
      await supabase.auth.signOut();

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", `${path}${request.nextUrl.search}`);

      const redirect = NextResponse.redirect(loginUrl);
      response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
      redirect.cookies.delete(ACTIVITY_COOKIE);
      return redirect;
    }

    response.cookies.set(ACTIVITY_COOKIE, String(Date.now()), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
    });
  }

  if (protectedPath && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${path}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};