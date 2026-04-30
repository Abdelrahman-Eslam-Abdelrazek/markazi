import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "مركزي — منصة إدارة مراكز التعليم",
  description: "المنصة الشاملة لإدارة مراكز التعليم الخاصة في مصر",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className={`${cairo.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
    </html>
  );
}
