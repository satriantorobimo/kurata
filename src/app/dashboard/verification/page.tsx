import { CheckCircle2, CircleDotDashed, FilePenLine } from "lucide-react";
import { WorkspaceLayout } from "@/presentation/components/workspace/WorkspaceLayout";

const VERIFICATION_STEPS = [
  { icon: CheckCircle2, title: "Akun dibuat", detail: "29 Jul 2026, 09.15", complete: true },
  { icon: CheckCircle2, title: "Email dikonfirmasi", detail: "29 Jul 2026, 09.18", complete: true },
  { icon: CircleDotDashed, title: "Profil sedang ditinjau", detail: "Dimulai 30 Jul 2026, 10.05", complete: false },
  { icon: FilePenLine, title: "Akun terverifikasi", detail: "Menunggu hasil pemeriksaan", complete: false },
];

export default function UserVerificationPage() { return <WorkspaceLayout kind="user" title="Verifikasi akun" description="Lihat proses pemeriksaan profil dan tindakan yang mungkin diperlukan."><section className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card"><div className="flex items-start gap-4 rounded-xl bg-blue-50 p-4 text-blue-900"><CircleDotDashed className="mt-0.5 h-5 w-5 shrink-0" /><div><h2 className="font-bold">Profil sedang ditinjau</h2><p className="mt-1 text-body-md leading-6">Tidak ada tindakan yang diperlukan saat ini. Kami akan mengirim notifikasi saat pemeriksaan selesai.</p></div></div><ol className="mt-8 space-y-6">{VERIFICATION_STEPS.map(({ icon: Icon, title, detail, complete }, index) => <li key={title} className="flex gap-4"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${complete ? "bg-primary text-on-primary" : index === 2 ? "bg-blue-100 text-blue-800" : "bg-surface-container-high text-on-surface-variant"}`}><Icon className="h-5 w-5" /></span><div><p className="text-label-md font-label-md text-on-surface">{title}</p><p className="mt-1 text-label-sm text-on-surface-variant">{detail}</p></div></li>)}</ol></section></WorkspaceLayout>; }
