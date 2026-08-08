import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, ClipboardCheck, FileText, Plus, ShieldCheck } from "lucide-react";
import { GetBrokerWorkspace } from "@/application/use-cases/GetBrokerWorkspace";
import { container } from "@/infrastructure/di/container";
import { getCurrentAuthContext } from "@/infrastructure/security/authorization-dal";

export default async function BrokerDashboardPage() {
  const auth = await getCurrentAuthContext();
  if (!auth) redirect("/masuk");

  const workspace = await new GetBrokerWorkspace(container.workspaceRepo).execute(auth.userId);
  const pending = workspace.assets.filter((item) => item.status === "under_review" || item.status === "pending").length;
  const published = workspace.assets.filter((item) => item.status === "published").length;
  const needsChanges = workspace.assets.filter((item) => item.status === "changes_requested").length;
  const latest = workspace.assets[0];

  return <div className="min-h-screen bg-background pt-16 lg:pt-20"><div className="container-main py-10 md:py-14"><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Workspace Mitra Kurata</p><div className="mt-2 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><h1 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">Halo, {workspace.name.split(" ")[0]}</h1><p className="mt-2 max-w-xl text-body-md leading-6 text-on-surface-variant">Kelola pengajuan aset dan pantau status peninjauan listing Anda.</p></div><Link href="/broker/assets/new" className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 text-label-md font-label-md text-on-primary"><Plus className="h-4 w-4" />Tambah aset</Link></div><div className="mt-8 grid gap-4 md:grid-cols-3"><Card icon={ClipboardCheck} value={String(pending)} label="Menunggu peninjauan" /><Card icon={ShieldCheck} value={String(published)} label="Aset telah tayang" /><Card icon={FileText} value={String(needsChanges)} label="Perlu perbaikan" /></div><section className="mt-8 rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Pengajuan terbaru</p><h2 className="mt-2 text-xl font-bold text-on-surface">{latest?.title ?? "Belum ada pengajuan aset"}</h2><p className="mt-1 text-body-md text-on-surface-variant">{latest ? `${latest.location} · diperbarui ${latest.updatedAt}` : "Ajukan aset pertama Anda untuk mulai berkolaborasi dengan Kurata."}</p></div>{latest && <span className="w-fit rounded-full bg-amber-100 px-3 py-1.5 text-label-sm font-label-sm text-amber-800">Menunggu</span>}</div><Link href="/broker/assets/new" className="mt-5 inline-flex items-center gap-1 text-label-md font-label-md text-primary hover:underline">Ajukan aset lain <ArrowRight className="h-4 w-4" /></Link></section></div></div>;
}
function Card({ icon: Icon, value, label }: { icon: typeof ClipboardCheck; value: string; label: string }) { return <article className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-5 shadow-card"><Icon className="h-6 w-6 text-primary" /><p className="mt-5 text-3xl font-bold text-on-surface">{value}</p><p className="mt-1 text-body-md text-on-surface-variant">{label}</p></article>; }
