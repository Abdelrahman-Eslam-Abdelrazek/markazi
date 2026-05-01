import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Cairo, Inter } from "next/font/google";
import { routing } from "../../i18n/routing";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "مركزي — منصة إدارة مراكز التعليم",
    template: "%s | مركزي",
  },
  description: "المنصة الشاملة لإدارة مراكز التعليم الخاصة في مصر",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html dir={dir} lang={locale} className={`${cairo.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className={`min-h-screen bg-gray-50 antialiased ${dir === "rtl" ? "font-cairo" : "font-inter"}`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
