import Link from "next/link";
import { ArrowRight, BarChart3, Building2, ClipboardList, FileText, ListTree, UsersRound } from "lucide-react";

import { GetCmsDashboard } from "@/application/use-cases/cms/GetCmsDashboard";
import { container } from "@/infrastructure/di/container";
import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { Card } from "@/presentation/components/cms/Card";

export const dynamic = "force-dynamic";

export default async function CmsDashboardPage() {
  const data = await new GetCmsDashboard(container.cmsRepo).execute();

  const cards = [
    { href: "/cms/properties", label: "Total aset", value: String(data.properties.total), hint: `${data.properties.published} terbit`, icon: Building2 },
    { href: "/cms/properties", label: "Aset perlu tinjau", value: String(data.properties.pendingReview), hint: "Menunggu keputusan", icon: Building2 },
    { href: "/cms/blog", label: "Artikel blog", value: String(data.blog.total), hint: `${data.blog.published} terbit`, icon: FileText },
    { href: "/cms/forms", label: "Pengajuan masuk", value: String(data.forms.total), hint: `${data.forms.pending} menunggu`, icon: ClipboardList },
    { href: "/cms/users", label: "Pengguna", value: String(data.users.total), hint: `${data.users.active} aktif`, icon: UsersRound },
    { href: "/cms/sections", label: "Segmen konten", value: String(data.sections.total), hint: `${data.sections.published} aktif`, icon: ListTree },
    { href: "/cms/statistics", label: "Statistik", value: String(data.statistics.total), hint: `${data.statistics.published} tampil`, icon: BarChart3 },
  ];

  const quickLinks = [
    { href: "/cms/properties", label: "Kelola aset", description: "Listing, edit, dan review aset.", icon: Building2 },
    { href: "/cms/forms", label: "Pengajuan masuk", description: "Pengajuan mitra, konsultasi, dan bantuan.", icon: ClipboardList },
    { href: "/cms/blog", label: "Artikel blog", description: "Tulis, terbitkan, dan kelola artikel.", icon: FileText },
    { href: "/cms/users", label: "Pengguna & verifikasi", description: "Kelola akun, peran, dan verifikasi.", icon: UsersRound },
  ];

  return (
    <>
      <PageHeader eyebrow="Kurata CMS" title="Dashboard" description="Ringkasan konten dan antrean seluruh platform Kurata." />

      <section className="rounded-2xl bg-primary p-6 text-on-primary md:p-8">
        <p className="text-label-sm font-medium uppercase tracking-wider text-on-primary-container">Prioritas</p>
        <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-bold">{data.properties.pendingReview} aset perlu ditinjau</h2>
            <p className="mt-2 max-w-xl leading-6 text-on-primary/80">Aset yang diajukan Mitra Kurata menunggu keputusan agar dapat tampil ke publik.</p>
          </div>
          <Link href="/cms/properties" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-3 text-label-md font-label-md text-primary hover:bg-surface-container-low">
            Mulai tinjau
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-5 shadow-card transition-transform hover:-translate-y-0.5">
            <card.icon className="h-6 w-6 text-primary" />
            <p className="mt-5 text-3xl font-bold text-on-surface">{card.value}</p>
            <p className="mt-1 text-label-md font-label-md text-on-surface">{card.label}</p>
            <p className="mt-1 text-label-sm leading-5 text-on-surface-variant">{card.hint}</p>
          </Link>
        ))}
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <link.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-headline-sm font-headline-sm text-on-surface">{link.label}</p>
                    <p className="mt-1 text-body-md leading-6 text-on-surface-variant">{link.description}</p>
                  </div>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-outline" />
              </div>
            </Card>
          </Link>
        ))}
      </section>
    </>
  );
}