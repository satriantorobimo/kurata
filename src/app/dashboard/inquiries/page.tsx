import { redirect } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { WorkspaceLayout } from "@/presentation/components/workspace/WorkspaceLayout";
import { GetUserWorkspace } from "@/application/use-cases/GetUserWorkspace";
import { container } from "@/infrastructure/di/container";
import { getCurrentAuthContext } from "@/infrastructure/security/authorization-dal";

export default async function InquiriesPage() {
  const auth = await getCurrentAuthContext();
  if (!auth) redirect("/masuk");

  const workspace = await new GetUserWorkspace(container.workspaceRepo).execute(auth.userId, auth.email);

  return <WorkspaceLayout kind="user" title="Pertanyaan saya" description="Pantau respons dan jadwal terkait properti yang Anda minati."><section className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-container-lowest shadow-card"><div className="divide-y divide-border-subtle">{workspace.inquiries.map((inquiry) => <article key={inquiry.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><MessageSquare className="h-5 w-5" /></div><div><p className="text-label-sm text-outline">{inquiry.id}</p><h2 className="mt-1 text-label-md font-label-md text-on-surface">{inquiry.title}</h2><p className="mt-1 text-label-sm text-on-surface-variant">{inquiry.broker} · diperbarui {inquiry.updatedAt}</p></div></div><span className="w-fit rounded-full bg-status-info-container px-3 py-1.5 text-label-sm text-status-info">{inquiry.status}</span></article>)}</div></section></WorkspaceLayout>;
}
