"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BriefcaseBusiness, Heart, LayoutDashboard, MessageSquare, ShieldCheck, UserRound } from "lucide-react";
import { cn } from "@/lib/cn";

type WorkspaceKind = "user" | "broker";

const USER_NAV = [
  { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/dashboard/verification", label: "Verifikasi", icon: ShieldCheck },
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
  const nav = kind === "user" ? USER_NAV : BROKER_NAV;
  return <div className="min-h-screen bg-background pt-20"><div className="container-main py-8 md:py-12"><div className="grid gap-6 lg:grid-cols-[235px_minmax(0,1fr)]"><aside className="h-fit rounded-2xl border border-border-subtle bg-surface-container-lowest p-3 shadow-card"><p className="px-3 pb-3 pt-2 text-label-sm font-label-sm uppercase tracking-wider text-primary">{kind === "broker" ? "Workspace broker" : "Akun Kurata"}</p><nav className="flex gap-1 overflow-x-auto lg:flex-col">{nav.map(({ href, label, icon: Icon }) => { const active = href === "/dashboard" || href === "/broker/dashboard" ? pathname === href : pathname.startsWith(href); return <Link key={href} href={href} className={cn("flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-label-md transition-colors", active ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary")}><Icon className="h-5 w-5" />{label}</Link>; })}</nav></aside><main><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">{kind === "broker" ? "Broker Partner Kurata" : "Kurata workspace"}</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-on-surface md:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-body-md leading-6 text-on-surface-variant">{description}</p><div className="mt-7">{children}</div></main></div></div></div>;
}
