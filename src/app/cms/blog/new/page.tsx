import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { BlogForm } from "@/presentation/components/cms/BlogForm";
import { getCmsAccess } from "../../access";

export const dynamic = "force-dynamic";

export default async function CmsNewBlogPage() {
  const { canWrite } = await getCmsAccess();
  if (!canWrite) redirect("/cms/blog");

  return (
    <>
      <Link href="/cms/blog" className="inline-flex items-center gap-2 text-label-md font-medium text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke artikel
      </Link>
      <div className="mt-5">
        <PageHeader eyebrow="Kurata CMS" title="Tulis artikel" description="Buat artikel blog baru untuk konten Kurata." />
      </div>
      <BlogForm mode="create" />
    </>
  );
}