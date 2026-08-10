"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, BriefcaseBusiness, Heart, LayoutDashboard, Menu, MessageSquare, ShieldCheck, UserRound, X } from "lucide-react";
import { cn } from "@/lib/cn";

type WorkspaceKind = "user" | "broker";

const USER_NAV = [
  { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/dashboard/favorites", label: "Properti tersimpan", icon: Heart },
  { href: "/dashboard/inquiries", label: "Pertanyaan saya", icon: MessageSquare },
  { href: "/dashboard/profile", label: "Profil", icon: UserRound },
];
const BROKER_NAV = [
  { href: "/broker/dashboard", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/broker/verification", label: "Status kemitraan", icon: ShieldCheck },
  { href: "/broker/assets", label: "Aset saya", icon: BriefcaseBusiness },
  { href: "/broker/notifications", label: "Notifikasi", icon: Bell },
  { href: "/broker/profile", label: "Profil broker", icon: UserRound },
];

export function WorkspaceLayout({ kind, title, description, children }: { kind: WorkspaceKind; title: string; description: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const nav = kind === "user" ? USER_NAV : BROKER_NAV;

  // Close the mobile drawer whenever the route changes.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileNavOpen(false);
  }

  const renderNav = (onNavigate?: () => void) => (
    <nav className="flex-col gap-1 pt-5">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = href === "/dashboard" || href === "/broker/dashboard" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-label-md transition-colors",
              active ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary",
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background pt-16 lg:pt-20">
      <div className="container-main py-8 md:py-12">
        <div className="grid gap-6 lg:grid-cols-[235px_minmax(0,1fr)]">
          {/* Desktop sidebar */}
          <aside className="hidden h-fit rounded-2xl border border-border-subtle bg-surface-container-lowest p-3 shadow-card lg:block">
            <p className="px-3 pb-3 pt-2 text-label-sm font-label-sm uppercase tracking-wider text-primary">
              {kind === "broker" ? "Workspace broker" : "Akun Kurata"}
            </p>
            {renderNav()}
          </aside>

          {/* Mobile drawer */}
          {mobileNavOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <button
                type="button"
                aria-label="Tutup menu"
                onClick={() => setMobileNavOpen(false)}
                className="absolute inset-0 bg-black/40"
              />
              <div className="absolute left-0 top-0 h-full w-70 max-w-[85vw] overflow-y-auto bg-surface-container-lowest p-3 shadow-card">
                <div className="flex items-center justify-between px-2 pb-2 pt-1">
                  <p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">
                    {kind === "broker" ? "Workspace broker" : "Akun Kurata"}
                  </p>
                  <button
                    type="button"
                    aria-label="Tutup menu"
                    onClick={() => setMobileNavOpen(false)}
                    className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {renderNav(() => setMobileNavOpen(false))}
              </div>
            </div>
          )}

          {/* Mobile toggle button */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Buka menu navigasi"
            className="mb-1 inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-surface-container-lowest px-4 py-3 text-label-md font-label-md text-on-surface shadow-card lg:hidden"
          >
            <Menu className="h-5 w-5 text-primary" />
            Menu
          </button>

          <main>
            <p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">{kind === "broker" ? "Mitra Kurata" : "Kurata workspace"}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-on-surface md:text-4xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-body-md leading-6 text-on-surface-variant">{description}</p>
            <div className="mt-7">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}