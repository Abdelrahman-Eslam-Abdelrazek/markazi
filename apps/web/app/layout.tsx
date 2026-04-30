import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "مركزي — منصة إدارة مراكز التعليم",
  description: "المنصة الشاملة لإدارة مراكز التعليم الخاصة في مصر",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
