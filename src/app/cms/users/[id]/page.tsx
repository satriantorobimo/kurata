import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { GetCmsUserDetail } from "@/application/use-cases/cms/GetCmsUsers";
import { container } from "@/infrastructure/di/container";
import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { UserDetailPage } from "@/presentation/components/cms/UserDetailPage";
import { StatusBadge } from "@/presentation/components/cms/StatusBadge";
import { getCmsAccess } from "../../access";

export const dynamic = "force-dynamic";

export default async function CmsUserDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { canWrite } = await getCmsAccess();

  const user = await new GetCmsUserDetail(container.cmsRepo).execute(id);
  if (!user) notFound();

  return (
    <>
      <Link href="/cms/users" className="inline-flex items-center gap-2 text-label-md font-medium text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke pengguna
      </Link>
      <div className="mt-5">
        <PageHeader eyebrow="Kurata CMS" title={user.fullName} description={user.email} actions={<StatusBadge value={user.emailVerifiedAt ? "verified" : "user"} label={user.emailVerifiedAt ? "Email terverifikasi" : undefined} />} />
      </div>
      <UserDetailPage user={user} canWrite={canWrite} />
    </>
  );
}