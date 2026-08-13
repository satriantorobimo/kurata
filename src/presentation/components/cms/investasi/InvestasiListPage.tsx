"use client";

import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";

import type { CmsContentSection } from "@/infrastructure/repositories/PostgresCmsRepository";
import { Card } from "@/presentation/components/cms/Card";
import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { StatusBadge } from "@/presentation/components/cms/StatusBadge";
import { InitializeInvestasiSectionButton } from "./InitializeInvestasiSectionButton";

const SECTION_META: Record<string, { label: string; preview(section: CmsContentSection): string }> = {
  "investasi-categories": { label: "Kategori", preview: (row) => `${Array.isArray(row.content) ? row.content.length : 0} kategori` },
  "investasi-features": { label: "Fitur unggulan", preview: (row) => `${Array.isArray(row.content) ? row.content.length : 0} fitur` },
  "investasi-opportunities": { label: "Peluang bisnis", preview: (row) => `${Array.isArray(row.content) ? row.content.length : 0} poin` },
  "investasi-area-analysis": { label: "Analisis area", preview: (row) => `${Array.isArray(row.content) ? row.content.length : 0} metrik` },
  "investasi-infrastructure": { label: "Infrastruktur", preview: (row) => `${Array.isArray(row.content) ? row.content.length : 0} item` },
  "investasi-similar": { label: "Listing serupa", preview: (row) => `${Array.isArray(row.content) ? row.content.length : 0} lahan` },
  "investasi-score-metrics": { label: "Skor metrik", preview: (row) => `${Array.isArray(row.content) ? row.content.length : 0} metrik` },
  "investasi-broker": { label: "Detail broker", preview: () => "Data mitra" },
};

export function InvestasiListPage({ sections, canWrite }: { sections: CmsContentSection[]; canWrite: boolean }) {
  const displayOrder = ["investasi-categories", "investasi-features", "investasi-opportunities", "investasi-area-analysis", "investasi-infrastructure", "investasi-similar", "investasi-score-metrics", "investasi-broker"];

  const ordered = displayOrder.map((id) => ({ id, section: sections.find((row) => row.id === id) }));

  return (
    <section>
      <PageHeader
        eyebrow="Kurata CMS"
        title="Potensi Lahan"
        description="Kelola konten halaman /investasi — kategori, listing rekomendasi, analisis, dan data mitra."
        actions={
          <Link href="/investasi" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-4 py-2.5 text-label-md font-label-md text-on-surface transition-colors hover:bg-surface-container-low">
            <ExternalLink className="h-4 w-4" />
            Lihat halaman
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <div className="mb-3 flex items-start justify-between gap-2">
            <h3 className="text-headline-sm font-headline-sm text-on-surface">Listing Potensi Lahan</h3>
            <StatusBadge value="published" />
          </div>
          <p className="text-label-sm text-on-surface-variant">Kelola listing lahan nyata yang hanya ditampilkan di halaman Potensi Lahan.</p>
          <div className="mt-auto pt-4">
            <Link href="/cms/investasi/listings" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90">
              <Pencil className="h-4 w-4" />
              Kelola listing
            </Link>
          </div>
        </Card>
        {ordered.map(({ id, section }) => {
          const meta = SECTION_META[id];
          if (!meta) return null;

          return (
            <Card key={id} className="flex flex-col">
              <div className="mb-3 flex items-start justify-between gap-2">
                <h3 className="text-headline-sm font-headline-sm text-on-surface">{meta.label}</h3>
                {section ? <StatusBadge value={section.isPublished ? "published" : "draft"} /> : <StatusBadge value="draft" />}
              </div>
              {section ? (
                <>
                  <p className="text-label-sm text-on-surface-variant">{meta.preview(section)}</p>
                  <p className="mt-1 text-label-sm text-on-surface-variant">Diperbarui {section.updatedAt}</p>
                </>
              ) : <p className="text-label-sm text-on-surface-variant">Konten belum disiapkan.</p>}
              <div className="mt-auto pt-4">
                {section && canWrite ? (
                  <Link href={`/cms/investasi/${id.replace("investasi-", "")}`} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                ) : !section && canWrite ? (
                  <InitializeInvestasiSectionButton sectionId={id} />
                ) : (
                  <span className="text-label-sm text-on-surface-variant">Mode tampilan</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
