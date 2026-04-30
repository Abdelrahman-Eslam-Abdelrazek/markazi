import { getTranslations } from "next-intl/server";
import { createSupabaseServerClient } from "@markazi/db";
import { SignOutButton } from "./sign-out-button";

async function Sidebar() {
  const t = await getTranslations("nav");

  const menuItems = [
    { key: "dashboard", href: "/dashboard" },
    { key: "courses", href: "/courses" },
    { key: "students", href: "/students" },
    { key: "instructors", href: "/instructors" },
    { key: "payments", href: "/payments" },
    { key: "attendance", href: "/attendance" },
    { key: "exams", href: "/exams" },
    { key: "assignments", href: "/assignments" },
    { key: "messages", href: "/messages" },
    { key: "reports", href: "/reports" },
    { key: "schedule", href: "/schedule" },
    { key: "certificates", href: "/certificates" },
    { key: "settings", href: "/settings" },
  ];

  return (
    <aside className="fixed inset-y-0 start-0 z-30 hidden w-64 flex-col border-e border-gray-200 bg-white lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <span className="text-xl font-bold text-primary-600">مركزي</span>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.key}>
              <a
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-primary-50 hover:text-primary-700"
              >
                {t(item.key)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

async function Header() {
  const t = await getTranslations("nav");
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <span className="text-lg font-bold text-primary-600 lg:hidden">مركزي</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <span className="sr-only">{t("notifications")}</span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="hidden text-sm font-medium text-gray-700 sm:block">{name}</span>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ps-64">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
