import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { GetUserWorkspace } from "@/application/use-cases/GetUserWorkspace";
import { container } from "@/infrastructure/di/container";
import { getCurrentAuthContext } from "@/infrastructure/security/authorization-dal";
import { WorkspaceLayout } from "@/presentation/components/workspace/WorkspaceLayout";

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await getCurrentAuthContext();
  if (!auth) redirect("/masuk");

  const { id } = await params;
  const workspace = await new GetUserWorkspace(container.workspaceRepo).execute(
    auth.userId,
    auth.email,
  );
  const inquiry = workspace.inquiries.find((item) => item.id === id);

  if (!inquiry) notFound();

  return (
    <WorkspaceLayout
      kind="user"
      title={inquiry.title}
      description={`Referensi ${inquiry.id}`}
    >
      <Link
        href="/dashboard/inquiries"
        className="inline-flex items-center gap-2 text-label-md font-label-md text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Kembali ke pertanyaan saya
      </Link>

      <section className="mt-6 rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MessageSquare className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-label-sm text-outline">Status</p>
            <p className="mt-1 text-label-md font-label-md text-on-surface">
              {inquiry.status}
            </p>
            <p className="mt-2 text-label-sm text-on-surface-variant">
              Diperbarui {inquiry.updatedAt}
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-border-subtle pt-5">
          <h2 className="text-label-md font-label-md text-on-surface">
            Langkah berikutnya
          </h2>
          <p className="mt-2 text-body-md leading-6 text-on-surface-variant">
            Tim {inquiry.broker} akan meninjau pertanyaan Anda dan menghubungi
            Anda melalui informasi kontak yang telah diberikan.
          </p>
        </div>
      </section>
    </WorkspaceLayout>
  );
}
