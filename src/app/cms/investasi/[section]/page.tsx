import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { GetCmsSectionDetail } from "@/application/use-cases/cms/GetCmsContent";
import { container } from "@/infrastructure/di/container";
import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { InvestasiSectionEditor } from "@/presentation/components/cms/investasi/InvestasiSectionEditor";
import { getCmsAccess } from "../../access";

export const dynamic = "force-dynamic";

const SLUG_TO_ID: Record<string, string> = {
  categories: "investasi-categories",
  listings: "investasi-listings",
  features: "investasi-features",
  opportunities: "investasi-opportunities",
  "area-analysis": "investasi-area-analysis",
  infrastructure: "investasi-infrastructure",
  similar: "investasi-similar",
  "score-metrics": "investasi-score-metrics",
  broker: "investasi-broker",
};

const SECTION_LABELS: Record<string, string> = {
  "investasi-categories": "Kategori",
  "investasi-listings": "Listing rekomendasi",
  "investasi-features": "Fitur unggulan",
  "investasi-opportunities": "Peluang bisnis",
  "investasi-area-analysis": "Analisis area",
  "investasi-infrastructure": "Infrastruktur",
  "investasi-similar": "Listing serupa",
  "investasi-score-metrics": "Skor metrik",
  "investasi-broker": "Detail broker",
};

export default async function CmsInvestasiSectionEditPage({ params }: { params: Promise<{ section: string }> }) {
  const { section: slug } = await params;
  const { canWrite } = await getCmsAccess();

  const id = SLUG_TO_ID[slug];
  if (!id) notFound();

  const section = await new GetCmsSectionDetail(container.cmsRepo).execute(id);
  if (!section) redirect("/cms/investasi");

  const label = SECTION_LABELS[id] ?? slug;

  return (
    <>
      <Link href="/cms/investasi" className="inline-flex items-center gap-2 text-label-md font-medium text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Potensi Lahan
      </Link>
      <div className="mt-5">
        <PageHeader eyebrow="Kurata CMS" title={canWrite ? `Edit ${label}` : label} description={`ID: ${section.id}`} />
      </div>
      <InvestasiSectionEditor section={section} canWrite={canWrite} />
    </>
  );
}