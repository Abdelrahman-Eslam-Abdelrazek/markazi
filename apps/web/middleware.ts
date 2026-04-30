import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const intlMiddleware = createIntlMiddleware({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "as-needed",
});

function updateSupabaseSession(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as any),
          );
        },
      },
    },
  );

  return supabase.auth.getUser();
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Run i18n middleware first
  const response = intlMiddleware(request);

  // Refresh Supabase auth session
  await updateSupabaseSession(request, response);

  // Subdomain detection for center websites
  const hostname = request.headers.get("host") ?? "";
  const mainDomains = ["localhost:3000", "markazi.com", "www.markazi.com", "app.markazi.com"];
  const isMainDomain = mainDomains.some((d) => hostname.includes(d));

  if (!isMainDomain) {
    const subdomain = hostname.split(".")[0];
    if (subdomain) {
      response.headers.set("x-center-slug", subdomain);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|icons|images|fonts|favicon.ico|manifest.json|sw.js).*)"],
};
