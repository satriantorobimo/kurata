import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/presentation/components/layout/Header";
import { Footer } from "@/presentation/components/layout/Footer";
import { absoluteUrl, jsonLdScript, siteName, siteUrl } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: "Kurata — Ekosistem Pertanahan Terpercaya", template: "%s | Kurata" },
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
    url: absoluteUrl("/"),
  },
  alternates: { canonical: "/" },
  twitter: { card: "summary_large_image", title: "Kurata — Ekosistem Pertanahan Terpercaya", description: "Platform digital terpercaya untuk investasi dan transaksi tanah di Indonesia." },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript({ "@context": "https://schema.org", "@type": "Organization", name: siteName, url: absoluteUrl("/"), logo: absoluteUrl("/logo.png") }) }} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
