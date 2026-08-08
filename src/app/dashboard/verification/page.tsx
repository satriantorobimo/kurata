import { redirect } from "next/navigation";
import { CheckCircle2, CircleDotDashed, FilePenLine, LoaderCircle } from "lucide-react";
import { WorkspaceLayout } from "@/presentation/components/workspace/WorkspaceLayout";
import { GetUserWorkspace } from "@/application/use-cases/GetUserWorkspace";
import { container } from "@/infrastructure/di/container";
import { getCurrentAuthContext } from "@/infrastructure/security/authorization-dal";
import type { LucideIcon } from "lucide-react";

const STATUS_META: Record<string, { title: string; detail: string; icon: LucideIcon; complete: boolean }> = {
  approved: { title: "Akun terverifikasi", detail: "Verifikasi selesai. Akun aktif digunakan.", icon: CheckCircle2, complete: true },
  under_review: { title: "Profil sedang ditinjau", detail: "Tim Kurata sedang memeriksa data profil Anda.", icon: CircleDotDashed, complete: false },
  submitted: { title: "Profil diajukan", detail: "Pengajuan verifikasi telah diterima.", icon: LoaderCircle, complete: false },
  changes_requested: { title: "Perlu perbaikan", detail: "Lengkapi informasi yang diminta, lalu ajukan kembali.", icon: FilePenLine, complete: false },
  rejected: { title: "Verifikasi ditolak", detail: "Hubungi tim bantuan untuk langkah selanjutnya.", icon: FilePenLine, complete: false },
};

export default async function UserVerificationPage() {
  const auth = await getCurrentAuthContext();
  if (!auth) redirect("/masuk");

  const workspace = await new GetUserWorkspace(container.workspaceRepo).execute(auth.userId, auth.email);
  const meta = STATUS_META[workspace.verification] ?? STATUS_META.under_review;

  return <WorkspaceLayout kind="user" title="Verifikasi akun" description="Lihat proses pemeriksaan profil dan tindakan yang mungkin diperlukan."><section className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card"><div className={`flex items-start gap-4 rounded-xl p-4 ${workspace.verification === "approved" ? "bg-emerald-50 text-emerald-900" : "bg-blue-50 text-blue-900"}`}><meta.icon className="mt-0.5 h-5 w-5 shrink-0" /><div><h2 className="font-bold">{meta.title}</h2><p className="mt-1 text-body-md leading-6">{meta.detail}</p></div></div>      <ol className="mt-8 space-y-6">{Object.entries(STATUS_META).map(([status, step]) => { const Icon = step.icon; const active = status === workspace.verification; return <li key={status} className="flex gap-4"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${step.complete || (workspace.verification === "approved" && status !== "under_review") ? "bg-primary text-on-primary" : active ? "bg-blue-100 text-blue-800" : "bg-surface-container-high text-on-surface-variant"}`}><Icon className="h-5 w-5" /></span><div><p className="text-label-md font-label-md text-on-surface">{step.title}</p><p className="mt-1 text-label-sm text-on-surface-variant">{step.detail}</p></div></li>; })}</ol></section></WorkspaceLayout>;
}
