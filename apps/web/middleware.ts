import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const protectedRoutes = ["/dashboard", "/courses", "/students", "/instructors", "/payments", "/attendance", "/exams", "/assignments", "/messages", "/reports", "/schedule", "/certificates", "/center", "/settings"];
const authRoutes = ["/login", "/register"];
const setupRoute = "/setup";

function stripLocalePrefix(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return pathname.slice(locale.length + 1) || "/";
    }
  }
  return pathname;
}

export default async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return response;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options as any),
        );
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const cleanPath = stripLocalePrefix(request.nextUrl.pathname);

  // Unauthenticated → redirect to login from protected routes
  const isProtected = protectedRoutes.some((r) => cleanPath.startsWith(r));
  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Authenticated → redirect away from auth routes
  const isAuthRoute = authRoutes.some((r) => cleanPath.startsWith(r));
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Authenticated + on protected route → check if user has a center
  if (user && isProtected) {
    const { data: membership } = await supabase
      .from("center_memberships")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .limit(1)
      .single();

    if (!membership) {
      return NextResponse.redirect(new URL("/setup", request.url));
    }
  }

  // On setup page but already has a center → go to dashboard
  if (user && cleanPath.startsWith(setupRoute)) {
    const { data: membership } = await supabase
      .from("center_memberships")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .limit(1)
      .single();

    if (membership) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|icons|images|fonts|favicon\\.ico|manifest\\.json|sw\\.js).*)"],
};
