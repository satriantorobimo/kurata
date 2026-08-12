import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { SalesForm } from "@/presentation/components/cms/SalesForm";
import { getCmsAccess } from "../../access";

export const dynamic = "force-dynamic";

export default async function CmsNewSalesPage() {
  const { canWrite } = await getCmsAccess();
  if (!canWrite) redirect("/cms/sales");

  return (
    <>
      <Link href="/cms/sales" className="inline-flex items-center gap-2 text-label-md font-medium text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke sales
      </Link>
      <div className="mt-5">
        <PageHeader eyebrow="Kurata CMS" title="Tambah sales" description="Tambahkan anggota tim sales atau marketing baru." />
      </div>
      <SalesForm canWrite={canWrite} />
    </>
  );
}
