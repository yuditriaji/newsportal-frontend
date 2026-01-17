import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NewsPortal - Investigative News Intelligence",
  description: "AI-powered news aggregation with relationship mapping and impact analysis",
  keywords: ["news", "investigation", "AI", "analysis", "geopolitics", "business"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[var(--background)]`}
      >
        <Sidebar />
        <Header />
        <main className="ml-64 mt-16 min-h-[calc(100vh-4rem)] p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
