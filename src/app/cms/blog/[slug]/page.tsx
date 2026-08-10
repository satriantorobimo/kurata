import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { GetCmsBlogDetail } from "@/application/use-cases/cms/GetCmsBlog";
import { container } from "@/infrastructure/di/container";
import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { BlogForm } from "@/presentation/components/cms/BlogForm";
import { StatusBadge } from "@/presentation/components/cms/StatusBadge";
import { getCmsAccess } from "../../access";

export const dynamic = "force-dynamic";

export default async function CmsBlogEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { canWrite } = await getCmsAccess();

  const article = await new GetCmsBlogDetail(container.cmsRepo).execute(slug);
  if (!article) notFound();

  return (
    <>
      <Link href="/cms/blog" className="inline-flex items-center gap-2 text-label-md font-medium text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke artikel
      </Link>
      <div className="mt-5">
        <PageHeader eyebrow="Kurata CMS" title={canWrite ? "Edit artikel" : "Detail artikel"} description={article.title} actions={<StatusBadge value={article.isPublished ? "published" : "draft"} />} />
      </div>
      {canWrite ? <BlogForm mode="edit" slug={slug} initial={article} /> : <ReadOnlyBlogNotice slug={slug} />}
    </>
  );
}

function ReadOnlyBlogNotice({ slug }: { slug: string }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card">
      <p className="rounded-xl bg-surface-container-low px-4 py-3 text-body-md text-on-surface-variant">
        Anda masuk sebagai mode tampilan. Hubungi Master Admin untuk mengubah artikel ini.
      </p>
      <Link href={`/blog/${slug}`} className="mt-4 inline-flex text-label-md font-medium text-primary hover:underline">
        Lihat di situs →
      </Link>
    </div>
  );
}