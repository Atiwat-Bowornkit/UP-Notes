import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "UP-Notes", template: "%s · UP-Notes" },
  description: "คลังปันสรุปบทเรียนและโน้ตย่อสำหรับนิสิต มหาวิทยาลัยพะเยา",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body className="flex min-h-screen flex-col">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2"
        >
          ข้ามไปยังเนื้อหา
        </a>
        <Navbar />
        <main id="content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 animate-fade-in">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
