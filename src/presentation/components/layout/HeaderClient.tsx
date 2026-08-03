"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { logout } from "@/app/auth/actions";
import { Button } from "@/presentation/components/shared/Button";
import { cn } from "@/lib/cn";

interface NavLink { label: string; href: string; }
interface HeaderUser { role: "user" | "broker" | "admin" | "super_admin"; }

const NAV_LINKS: NavLink[] = [
  { label: "Beranda", href: "/" },
  { label: "Cari Tanah", href: "/cari-tanah" },
  { label: "Untuk Broker", href: "/untuk-broker" },
  { label: "Layanan Investasi", href: "/investasi" },
  { label: "Layanan Kurata", href: "/layanan" },
  { label: "Blog", href: "/blog" },
  { label: "Bantuan", href: "/bantuan" },
];

function dashboardHref(role: HeaderUser["role"]): string {
  if (role === "admin" || role === "super_admin") return "/admin";
  if (role === "broker") return "/broker/dashboard";
  return "/dashboard";
}

export function HeaderClient() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<HeaderUser | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/auth/session", { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() : { user: null })
      .then((payload: { user: HeaderUser | null }) => setUser(payload.user))
      .catch(() => undefined);

    return () => controller.abort();
  }, [pathname]);

  const dashboardLabel = user?.role === "super_admin" ? "Master Admin" : user?.role === "admin" ? "Admin" : user?.role === "broker" ? "Dashboard Broker" : "Dashboard";

  return <header className="fixed top-0 z-50 w-full bg-surface-container-lowest/90 shadow-glass backdrop-blur-md">
    <div className="container-main flex h-16 items-center justify-between md:h-20">
      <Link href="/" className="shrink-0"><Image src="/logo.png" alt="Kurata Logo" width={200} height={130} className="rounded-full object-cover " priority /></Link>
      <nav className="hidden items-center gap-5 xl:flex 2xl:gap-7">{NAV_LINKS.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return <Link key={link.href} href={link.href} className={cn("whitespace-nowrap text-label-md font-label-md transition-colors", active ? "font-bold text-primary" : "text-on-surface-variant hover:text-primary")}>{link.label}</Link>;
      })}</nav>
      <div className="hidden items-center gap-2 sm:flex md:gap-4">
        {user ? <>
          <Button variant="ghost" size="sm" href={dashboardHref(user.role)} className="md:px-6 md:py-2">{dashboardLabel}</Button>
          <form action={logout}><button type="submit" className="rounded-lg px-3 py-2 text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-low hover:text-primary">Keluar</button></form>
        </> : <>
          <Button variant="ghost" size="sm" href="/masuk" className="md:px-6 md:py-2">Masuk</Button>
          <Button variant="primary" size="sm" href="/daftar" className="md:px-6 md:py-2">Daftar</Button>
        </>}
      </div>
      <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-on-surface-variant transition-colors hover:text-primary xl:hidden" aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}>{mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
    </div>
    {mobileMenuOpen && <div className="border-t border-border-subtle bg-surface-container-lowest shadow-lg xl:hidden"><nav className="container-main flex flex-col gap-1 py-4">{NAV_LINKS.map((link) => {
      const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
      return <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={cn("rounded-lg px-4 py-3 text-label-md font-label-md transition-colors", active ? "bg-primary/10 font-bold text-primary" : "text-on-surface-variant hover:bg-surface-container-low")}>{link.label}</Link>;
    })}<div className="mt-4 flex gap-3 border-t border-border-subtle pt-4">{user ? <><Button variant="primary" size="md" href={dashboardHref(user.role)} className="flex-1">{dashboardLabel}</Button><form action={logout} className="flex-1"><button type="submit" className="w-full rounded-lg border border-border-subtle px-4 py-3 text-label-md font-label-md text-on-surface">Keluar</button></form></> : <><Button variant="ghost" size="md" href="/masuk" className="flex-1">Masuk</Button><Button variant="primary" size="md" href="/daftar" className="flex-1">Daftar</Button></>}</div></nav></div>}
  </header>;
}
