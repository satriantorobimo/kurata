"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/presentation/components/shared/Button";
import { cn } from "@/lib/cn";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Beranda", href: "/" },
  { label: "Cari Tanah", href: "/cari-tanah" },
  { label: "Untuk Broker", href: "/untuk-broker" },
  { label: "Layanan Kurata", href: "/layanan" },
  { label: "Blog", href: "/blog" },
  { label: "Bantuan", href: "/bantuan" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-md shadow-glass">
      <div className="h-16 md:h-20 container-main flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Kurata Logo"
            width={56}
            height={56}
            className="rounded-full object-cover md:w-20 md:h-20"
            priority
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-label-md font-label-md transition-colors whitespace-nowrap",
                  isActive
                    ? "text-primary font-bold"
                    : "text-on-surface-variant hover:text-primary",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden sm:flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="sm" href="/masuk" className="md:px-6 md:py-2">
            Masuk
          </Button>
          <Button variant="primary" size="sm" href="/daftar" className="md:px-6 md:py-2">
            Daftar
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-on-surface-variant hover:text-primary transition-colors"
          aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-t border-border-subtle shadow-lg">
          <nav className="container-main py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "py-3 px-4 rounded-lg text-label-md font-label-md transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-on-surface-variant hover:bg-surface-container-low",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex gap-3 mt-4 pt-4 border-t border-border-subtle">
              <Button variant="ghost" size="md" href="/masuk" className="flex-1">
                Masuk
              </Button>
              <Button variant="primary" size="md" href="/daftar" className="flex-1">
                Daftar
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
