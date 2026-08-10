"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Building2, ClipboardList, ExternalLink, FileText, LayoutDashboard, ListTree, LogOut, TrendingUp, UsersRound } from "lucide-react";
import { logout } from "@/app/auth/actions";
import { cn } from "@/lib/cn";

export const CMS_NAV = [
  { href: "/cms", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/cms/properties", label: "Aset", icon: Building2, match: "/cms/properties" },
  { href: "/cms/blog", label: "Blog", icon: FileText, match: "/cms/blog" },
  { href: "/cms/investasi", label: "Potensi Lahan", icon: TrendingUp, match: "/cms/investasi" },
  { href: "/cms/sections", label: "Segmen Konten", icon: ListTree, match: "/cms/sections" },
  { href: "/cms/statistics", label: "Statistik", icon: BarChart3, match: "/cms/statistics" },
  { href: "/cms/forms", label: "Pengajuan", icon: ClipboardList, match: "/cms/forms" },
  { href: "/cms/users", label: "Pengguna", icon: UsersRound, match: "/cms/users" },
];

export function isActive(pathname: string, item: (typeof CMS_NAV)[number]): boolean {
  if (item.exact) return pathname === item.href;
  return pathname.startsWith(item.match ?? item.href);
}

export function CmsSidebar({ role, email }: { role: string; email: string }) {
  const pathname = usePathname();
  const roleLabel = role === "super_admin" ? "Master Admin" : "Admin";

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border-subtle bg-surface-container-lowest lg:flex">
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-label-md font-bold text-on-primary">K</div>
        <div>
          <p className="text-label-md font-label-md text-on-surface">Kurata CMS</p>
          <p className="text-label-sm text-on-surface-variant">Manajemen konten</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {CMS_NAV.map((item) => {
          const active = isActive(pathname, item);
          return (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-xl px-4 py-3 text-label-md transition-colors", active ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary")}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border-subtle p-4">
        <div className="flex items-center gap-3 rounded-xl bg-surface-container-low px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-label-md font-bold text-primary">{email.slice(0, 1).toUpperCase()}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-label-sm font-label-sm text-on-surface">{email}</p>
            <p className="text-label-sm text-primary">{roleLabel}</p>
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <Link href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg px-3 py-2 text-label-sm text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary">
            <ExternalLink className="h-4 w-4" />
            Lihat situs
          </Link>
          <form action={logout}>
            <button type="submit" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-label-sm text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-error">
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}