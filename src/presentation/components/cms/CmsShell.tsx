"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

import { logout } from "@/app/auth/actions";
import { cn } from "@/lib/cn";
import { CmsSidebar, CMS_NAV, isActive } from "./CmsSidebar";

export function CmsShell({ role, email, children }: { role: string; email: string; children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-surface-container-low">
      <CmsSidebar role={role} email={email} />
      <div className="lg:pl-64">
        <div className="sticky top-0 z-30 border-b border-border-subtle bg-background/90 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-4 pt-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-label-md font-bold text-on-primary">K</div>
              <div>
                <p className="text-label-md font-label-md text-on-surface">Kurata CMS</p>
                <p className="text-label-sm text-on-surface-variant">{role === "super_admin" ? "Master Admin" : "Admin"}</p>
              </div>
            </div>
            <form action={logout}>
              <button type="submit" aria-label="Keluar dari CMS" className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low hover:text-error">
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-2 py-2">
            {CMS_NAV.map((item) => {
              const active = isActive(pathname, item);
              return (
                <Link key={item.href} href={item.href} className={cn("flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-label-sm transition-colors", active ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary")}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}