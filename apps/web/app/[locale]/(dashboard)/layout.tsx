import { getTranslations } from "next-intl/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@markazi/db";
import { SignOutButton } from "./sign-out-button";
import { SidebarLink } from "./sidebar-link";
import { MobileMenuButton } from "./mobile-nav";

async function getUserCenter() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = await createSupabaseAdminClient();

  const { data: publicUser } = await admin
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!publicUser) return null;

  const { data: membership } = await admin
    .from("center_memberships")
    .select("role, centers(id, name_ar, name_en, slug, primary_color, logo)")
    .eq("user_id", publicUser.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!membership) return null;

  const center = (membership as any).centers;
  return {
    user,
    role: membership.role as string,
    center: center as { id: string; name_ar: string; name_en: string | null; slug: string; primary_color: string | null; logo: string | null },
  };
}

async function Sidebar() {
  const t = await getTranslations("nav");
  const ctx = await getUserCenter();
  if (!ctx) return null;

  const menuItems = [
    { key: "dashboard", href: "/dashboard", icon: "grid" },
    { key: "courses", href: "/courses", icon: "book" },
    { key: "students", href: "/students", icon: "users" },
    { key: "instructors", href: "/instructors", icon: "graduation" },
    { key: "payments", href: "/payments", icon: "credit-card" },
    { key: "attendance", href: "/attendance", icon: "clipboard" },
    { key: "exams", href: "/exams", icon: "file-text" },
    { key: "assignments", href: "/assignments", icon: "edit" },
    { key: "messages", href: "/messages", icon: "message" },
    { key: "reports", href: "/reports", icon: "bar-chart" },
    { key: "settings", href: "/settings", icon: "settings" },
  ];

  const color = ctx.center.primary_color || "#2563EB";

  return (
    <aside className="fixed inset-y-0 start-0 z-30 hidden w-64 flex-col border-e border-gray-200 bg-white lg:flex">
      {/* Center Identity */}
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-5">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {ctx.center.name_ar.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">{ctx.center.name_ar}</p>
          <p className="truncate text-xs text-gray-400">{ctx.role === "CENTER_OWNER" ? "مالك المركز" : ctx.role}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.key}>
              <SidebarLink href={item.href} icon={item.icon}>
                {t(item.key)}
              </SidebarLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-200 p-3">
        <SidebarLink href="/center/settings" icon="building">
          {t("center")}
        </SidebarLink>
      </div>
    </aside>
  );
}

async function Header() {
  const t = await getTranslations("nav");
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <MobileMenuButton />
        <span className="text-lg font-bold text-primary-600 lg:hidden">مركزي</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute end-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="h-6 w-px bg-gray-200" />
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="hidden text-sm font-medium text-gray-700 sm:block">{name}</span>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="lg:ps-64">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
