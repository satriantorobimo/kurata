import type { Metadata } from "next";
import { PublicChrome } from "@/presentation/components/layout/PublicChrome";
import { absoluteUrl, jsonLdScript, siteName, siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: "Kurata — Ekosistem Pertanahan Terpercaya", template: "%s | Kurata" },
  description:
    "Semua kebutuhan pertanahan, dari pencarian hingga transaksi, dalam satu platform digital yang aman, transparan, dan profesional.",
  icons: {
    icon: [{ url: "/favicon.JPG", type: "image/jpeg" }],
    shortcut: "/favicon.JPG",
    apple: "/favicon.JPG",
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
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript({ "@context": "https://schema.org", "@type": "Organization", name: siteName, url: absoluteUrl("/"), logo: absoluteUrl("/logo.png") }) }} />
        <PublicChrome>{children}</PublicChrome>
      </body>
    </html>
  );
}
