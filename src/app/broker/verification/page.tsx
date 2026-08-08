import { redirect } from "next/navigation";
import { CheckCircle2, CircleDotDashed, FilePenLine } from "lucide-react";
import { WorkspaceLayout } from "@/presentation/components/workspace/WorkspaceLayout";
import { GetBrokerWorkspace } from "@/application/use-cases/GetBrokerWorkspace";
import { container } from "@/infrastructure/di/container";
import { getCurrentAuthContext } from "@/infrastructure/security/authorization-dal";

export default async function BrokerVerificationPage() {
  const auth = await getCurrentAuthContext();
  if (!auth) redirect("/masuk");

  const workspace = await new GetBrokerWorkspace(container.workspaceRepo).execute(auth.userId);
  const approved = workspace.verification === "approved" || workspace.verification === "published";

  return <WorkspaceLayout kind="broker" title="Status kemitraan" description="Status verifikasi dan informasi kemitraan Mitra Kurata."><section className="rounded-2xl border border-primary/20 bg-primary/5 p-6"><div className="flex gap-3"><CheckCircle2 className="h-6 w-6 shrink-0 text-primary" /><div><h2 className="text-xl font-bold text-on-surface">{approved ? "Kemitraan aktif" : "Kemitraan sedang ditinjau"}</h2><p className="mt-2 text-body-md leading-6 text-on-surface-variant">{approved ? "Profil Mitra Kurata telah diverifikasi. Aset baru tetap memerlukan pemeriksaan sebelum tayang." : "Tim Kurata sedang memeriksa profil kemitraan Anda. Anda akan mendapat kabar saat pemeriksaan selesai."}</p></div></div></section><section className="mt-6 rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card"><h2 className="text-xl font-bold text-on-surface">Riwayat verifikasi</h2><div className="mt-6 space-y-5">{[[FilePenLine, "Aplikasi Mitra Kurata dikirim", "18 Jul 2026"], [CircleDotDashed, "Profil ditinjau Kurata", "19 Jul 2026"], [CheckCircle2, approved ? "Mitra Kurata terverifikasi" : "Menunggu keputusan Kurata", approved ? "20 Jul 2026" : "Dalam proses"]].map(([Icon, label, date]) => <div key={String(label)} className="flex gap-3"><Icon className="h-5 w-5 text-primary" /><div><p className="text-label-md font-label-md text-on-surface">{String(label)}</p><p className="mt-1 text-label-sm text-on-surface-variant">{String(date)}</p></div></div>)}</div></section></WorkspaceLayout>;
}
