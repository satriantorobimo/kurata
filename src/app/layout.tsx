import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/presentation/components/layout/Header";
import { Footer } from "@/presentation/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kurata — Ekosistem Pertanahan Terpercaya",
  description:
    "Semua kebutuhan pertanahan, dari pencarian hingga transaksi, dalam satu platform digital yang aman, transparan, dan profesional.",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Kurata — Ekosistem Pertanahan Terpercaya",
    description:
      "Platform digital terpercaya untuk investasi dan transaksi tanah di Indonesia.",
    siteName: "Kurata",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
