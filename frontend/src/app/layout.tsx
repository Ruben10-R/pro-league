import type { Metadata } from "next";
import "./globals.css";
import "@mantine/core/styles.css";

export const metadata: Metadata = {
  title: "Pro-League",
  description: "Tournament Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
