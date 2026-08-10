import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { UserForm } from "@/presentation/components/cms/UserForm";
import { getCmsAccess } from "../../access";

export const dynamic = "force-dynamic";

export default async function CmsNewUserPage() {
  const { canWrite } = await getCmsAccess();
  if (!canWrite) redirect("/cms/users");

  return (
    <>
      <Link href="/cms/users" className="inline-flex items-center gap-2 text-label-md font-medium text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke pengguna
      </Link>
      <div className="mt-5">
        <PageHeader eyebrow="Kurata CMS" title="Tambah pengguna" description="Buat akun baru beserta peran dan statusnya." />
      </div>
      <UserForm canWrite={canWrite} />
    </>
  );
}