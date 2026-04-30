import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const protectedRoutes = ["/dashboard", "/courses", "/students", "/payments", "/attendance", "/exams", "/assignments", "/messages", "/reports", "/schedule", "/certificates", "/center", "/settings"];
const authRoutes = ["/login", "/register"];

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

  const isProtected = protectedRoutes.some((r) => cleanPath.startsWith(r));
  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const isAuthRoute = authRoutes.some((r) => cleanPath.startsWith(r));
  if (isAuthRoute && user) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|icons|images|fonts|favicon\\.ico|manifest\\.json|sw\\.js).*)"],
};
