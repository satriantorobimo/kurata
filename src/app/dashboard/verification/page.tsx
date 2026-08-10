import { redirect } from "next/navigation";
import { CheckCircle2, CircleDotDashed, FilePenLine, LoaderCircle } from "lucide-react";
import { WorkspaceLayout } from "@/presentation/components/workspace/WorkspaceLayout";
import { VerificationForm } from "@/presentation/components/workspace/VerificationForm";
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

const VERIFICATION_ORDER = ["not_started", "submitted", "under_review", "approved"];

export default async function UserVerificationPage() {
  const auth = await getCurrentAuthContext();
  if (!auth) redirect("/masuk");

  const workspace = await new GetUserWorkspace(container.workspaceRepo).execute(auth.userId, auth.email);
  const status = workspace.verification;
  const meta = STATUS_META[status] ?? { title: "Verifikasi belum dimulai", detail: "Silakan lengkapi data identitas Anda untuk mulai proses verifikasi.", icon: FilePenLine, complete: false };

  const showForm = status === "not_started" || status === "changes_requested";

  return (
    <WorkspaceLayout kind="user" title="Verifikasi akun" description="Lengkapi verifikasi identitas agar akun Kurata Anda dapat digunakan sepenuhnya.">
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
          <VerificationForm />
        </div>
      ) : (
        <>
          <section className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card">
            <div className={`flex items-start gap-4 rounded-xl p-4 ${status === "approved" ? "bg-emerald-50 text-emerald-900" : "bg-blue-50 text-blue-900"}`}>
              <meta.icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <h2 className="font-bold">{meta.title}</h2>
                <p className="mt-1 text-body-md leading-6">{meta.detail}</p>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card">
            <h2 className="text-xl font-bold text-on-surface">Tahapan verifikasi</h2>
            <ol className="mt-6 space-y-6">
              {VERIFICATION_ORDER.map((step) => {
                const stepMeta = STATUS_META[step];
                if (!stepMeta) return null;
                const Icon = stepMeta.icon;
                const currentIndex = VERIFICATION_ORDER.indexOf(status);
                const stepIndex = VERIFICATION_ORDER.indexOf(step);
                const isPast = stepIndex < currentIndex;
                const isCurrent = step === status;
                return (
                  <li key={step} className="flex gap-4">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${stepMeta.complete || isPast ? "bg-primary text-on-primary" : isCurrent ? "bg-blue-100 text-blue-800" : "bg-surface-container-high text-on-surface-variant"}`}>
                      {stepMeta.complete || isPast ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </span>
                    <div>
                      <p className="text-label-md font-label-md text-on-surface">{stepMeta.title}</p>
                      <p className="mt-1 text-label-sm text-on-surface-variant">{stepMeta.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </>
      )}
    </WorkspaceLayout>
  );
}
