import { useTranslations } from "next-intl";

function Sidebar() {
  const t = useTranslations("nav");

  const menuItems = [
    { key: "dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { key: "courses", href: "/courses", icon: "BookOpen" },
    { key: "students", href: "/students", icon: "Users" },
    { key: "instructors", href: "/instructors", icon: "GraduationCap" },
    { key: "payments", href: "/payments", icon: "CreditCard" },
    { key: "attendance", href: "/attendance", icon: "ClipboardCheck" },
    { key: "exams", href: "/exams", icon: "FileText" },
    { key: "assignments", href: "/assignments", icon: "PenSquare" },
    { key: "messages", href: "/messages", icon: "MessageSquare" },
    { key: "reports", href: "/reports", icon: "BarChart3" },
    { key: "schedule", href: "/schedule", icon: "Calendar" },
    { key: "certificates", href: "/certificates", icon: "Award" },
    { key: "center", href: "/center/settings", icon: "Building2" },
    { key: "settings", href: "/settings", icon: "Settings" },
  ];

  return (
    <aside className="fixed inset-y-0 start-0 z-30 flex w-64 flex-col border-e border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <span className="text-xl font-bold text-primary-600">مركزي</span>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.key}>
              <a
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                <span className="h-5 w-5" />
                {t(item.key)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function Header() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden">
          <span className="sr-only">القائمة</span>
        </button>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <span className="sr-only">{t("notifications")}</span>
          <span className="absolute end-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary-100" />
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
      <div className="ps-0 lg:ps-64">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
