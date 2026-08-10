import { redirect } from "next/navigation";
import { CheckCircle2, CircleDotDashed, FilePenLine, Files } from "lucide-react";
import { WorkspaceLayout } from "@/presentation/components/workspace/WorkspaceLayout";
import { VerificationForm } from "@/presentation/components/workspace/VerificationForm";
import { GetBrokerWorkspace } from "@/application/use-cases/GetBrokerWorkspace";
import { container } from "@/infrastructure/di/container";
import { getCurrentAuthContext } from "@/infrastructure/security/authorization-dal";

export default async function BrokerVerificationPage() {
  const auth = await getCurrentAuthContext();
  if (!auth) redirect("/masuk");

  const workspace = await new GetBrokerWorkspace(container.workspaceRepo).execute(auth.userId);
  const status = workspace.verification;
  const approved = status === "approved" || status === "published";
  const showForm = status === "not_started" || status === "changes_requested";

  return (
    <WorkspaceLayout kind="broker" title="Status kemitraan" description="Status verifikasi dan informasi kemitraan Mitra Kurata.">
      {showForm ? (
        <div className="space-y-6">
          {status === "changes_requested" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="flex items-start gap-2 text-body-md text-amber-900">
                <FilePenLine className="mt-0.5 h-5 w-5 shrink-0" />
                Tim Kurata meminta perubahan pada data verifikasi Anda. Silakan perbarui dan kirimkan kembali.
              </p>
            </div>
          )}
          <section className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card">
            <h2 className="mb-5 text-xl font-bold text-on-surface">Dokumen kemitraan</h2>
            <p className="text-body-md leading-6 text-on-surface-variant">Sebelum mengajukan verifikasi identitas, pastikan dokumen pendukung kemitraan Anda telah dikirim melalui formulir pendaftaran Mitra Kurata.</p>
            <a href="/untuk-broker" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border-subtle px-4 py-2.5 text-label-md font-label-md text-primary hover:bg-primary/5">
              <Files className="h-4 w-4" />
              Buka formulir pendaftaran
            </a>
          </section>
          <section className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card">
            <h2 className="mb-5 text-xl font-bold text-on-surface">Verifikasi identitas</h2>
            <VerificationForm />
          </section>
        </div>
      ) : (
        <>
          <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex gap-3">
              <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <h2 className="text-xl font-bold text-on-surface">{approved ? "Kemitraan aktif" : "Kemitraan sedang ditinjau"}</h2>
                <p className="mt-2 text-body-md leading-6 text-on-surface-variant">{approved ? "Profil Mitra Kurata telah diverifikasi. Aset baru tetap memerlukan pemeriksaan sebelum tayang." : "Tim Kurata sedang memeriksa profil kemitraan Anda. Anda akan mendapat kabar saat pemeriksaan selesai."}</p>
              </div>
            </div>
          </section>
          <section className="mt-6 rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card">
            <h2 className="text-xl font-bold text-on-surface">Riwayat verifikasi</h2>
            <div className="mt-6 space-y-5">
              <div className="flex gap-3">
                <Files className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-label-md font-label-md text-on-surface">Aplikasi Mitra Kurata dikirim</p>
                  <p className="mt-1 text-label-sm text-on-surface-variant">Menunggu peninjauan administrasi</p>
                </div>
              </div>
              <div className="flex gap-3">
                {status === "submitted" || status === "under_review" || approved ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <CircleDotDashed className="h-5 w-5 text-primary" />}
                <div>
                  <p className="text-label-md font-label-md text-on-surface">Profil ditinjau Kurata</p>
                  <p className="mt-1 text-label-sm text-on-surface-variant">{status === "submitted" || status === "under_review" ? "Dalam proses peninjauan" : approved ? "Telah ditinjau" : "Menunggu pengajuan"}</p>
                </div>
              </div>
              <div className="flex gap-3">
                {approved ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <CircleDotDashed className="h-5 w-5 text-primary" />}
                <div>
                  <p className="text-label-md font-label-md text-on-surface">{approved ? "Mitra Kurata terverifikasi" : "Menunggu keputusan Kurata"}</p>
                  <p className="mt-1 text-label-sm text-on-surface-variant">{approved ? "Kemitraan sudah aktif" : "Dalam proses"}</p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </WorkspaceLayout>
  );
}
