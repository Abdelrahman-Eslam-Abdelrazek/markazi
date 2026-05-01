"use client";

import { useState } from "react";
import { usePathname } from "../../../i18n/navigation";

const menuItems = [
  { key: "لوحة التحكم", href: "/dashboard", icon: "grid" },
  { key: "الكورسات", href: "/courses", icon: "book" },
  { key: "الطلاب", href: "/students", icon: "users" },
  { key: "المدفوعات", href: "/payments", icon: "credit-card" },
  { key: "الحضور", href: "/attendance", icon: "clipboard" },
  { key: "الإعدادات", href: "/settings", icon: "settings" },
];

export function MobileMenuButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 lg:hidden"
        aria-label="القائمة"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 start-0 z-50 w-72 bg-white shadow-xl lg:hidden">
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
              <span className="text-lg font-bold text-primary-600">مركزي</span>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="px-3 py-4">
              <ul className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                          isActive
                            ? "bg-primary-50 text-primary-700"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        {item.key}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
