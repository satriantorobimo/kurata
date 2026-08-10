import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Heart, MessageSquare, ShieldCheck } from "lucide-react";
import { WorkspaceLayout } from "@/presentation/components/workspace/WorkspaceLayout";
import { StatusPill } from "@/presentation/components/workspace/StatusPill";
import { GetUserWorkspace } from "@/application/use-cases/GetUserWorkspace";
import { container } from "@/infrastructure/di/container";
import { getCurrentAuthContext } from "@/infrastructure/security/authorization-dal";
import type { WorkspaceStatus } from "@/application/config/workspaceDemoData";

export default async function UserDashboardPage() {
  const auth = await getCurrentAuthContext();
  if (!auth) redirect("/masuk");

  const workspace = await new GetUserWorkspace(container.workspaceRepo).execute(auth.userId, auth.email);
  const isVerified = workspace.verification === "approved";

  return <WorkspaceLayout kind="user" title={`Halo, ${workspace.name.split(" ")[0]}`} description="Pantau verifikasi akun, properti tersimpan, dan perkembangan pertanyaan Anda.">
    <section className="rounded-2xl bg-primary p-6 text-on-primary md:p-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-label-sm font-label-sm uppercase tracking-wider text-on-primary-container">Status akun</p>
          <h2 className="mt-2 text-2xl font-bold">{isVerified ? "Akun Anda terverifikasi" : "Verifikasi email Anda"}</h2>
          <p className="mt-2 max-w-xl text-body-md leading-6 text-on-primary/80">
            {isVerified
              ? "Email Anda sudah dikonfirmasi. Selamat menjelajah properti di Kurata."
              : "Klik tautan verifikasi yang dikirim ke email Anda untuk mengaktifkan akun sepenuhnya."}
          </p>
        </div>
        {!isVerified && (
          <Link href="/bantuan" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-label-md font-label-md text-primary sm:w-fit">
            Bantuan <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </section>
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <VerificationCard verified={isVerified} />
      <Link href="/dashboard/favorites" className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-5 shadow-card transition-transform hover:-translate-y-0.5">
        <Heart className="h-6 w-6 text-primary" />
        <p className="mt-5 text-label-md font-label-md text-on-surface">Properti tersimpan</p>
        <div className="mt-2 text-2xl font-bold text-on-surface">{workspace.favoriteProperties.length} aset</div>
      </Link>
      <Link href="/dashboard/inquiries" className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-5 shadow-card transition-transform hover:-translate-y-0.5">
        <MessageSquare className="h-6 w-6 text-primary" />
        <p className="mt-5 text-label-md font-label-md text-on-surface">Pertanyaan aktif</p>
        <div className="mt-2 text-2xl font-bold text-on-surface">{workspace.inquiries.length} percakapan</div>
      </Link>
    </div>
    <section className="mt-7 rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Aktivitas terbaru</p>
          <h2 className="mt-2 text-xl font-bold text-on-surface">Pertanyaan Anda</h2>
        </div>
        <Link href="/dashboard/inquiries" className="text-label-sm font-label-sm text-primary hover:underline">Lihat semua</Link>
      </div>
      <div className="mt-5 divide-y divide-border-subtle">
        {workspace.inquiries.map((inquiry) => (
          <Link key={inquiry.id} href={`/dashboard/inquiries/${inquiry.id}`} className="flex items-center justify-between gap-3 py-4 text-label-md text-on-surface hover:text-primary transition-colors">
            <div>
              <p className="font-medium">{inquiry.title}</p>
              <p className="text-body-sm text-on-surface-variant">{inquiry.broker} &middot; {inquiry.updatedAt}</p>
            </div>
            <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-label-sm font-label-sm text-amber-800">{inquiry.status}</span>
          </Link>
        ))}
        {workspace.inquiries.length === 0 && <p className="py-6 text-center text-body-md text-on-surface-variant">Belum ada pertanyaan.</p>}
      </div>
    </section>
  </WorkspaceLayout>;
}

function VerificationCard({ verified }: { verified: boolean }) {
  const pill = <StatusPill status={verified ? "approved" : "not_started"} />;

  if (verified) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-5 shadow-card">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <p className="mt-5 text-label-md font-label-md text-on-surface">Verifikasi akun</p>
        <div className="mt-2 text-2xl font-bold text-on-surface">{pill}</div>
      </div>
    );
  }

  return (
    <Link href="/bantuan" className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-5 shadow-card transition-transform hover:-translate-y-0.5">
      <ShieldCheck className="h-6 w-6 text-primary" />
      <p className="mt-5 text-label-md font-label-md text-on-surface">Verifikasi akun</p>
      <div className="mt-2 text-2xl font-bold text-on-surface">{pill}</div>
    </Link>
  );
}
