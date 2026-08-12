import type { Metadata } from "next";
import type {
  PropertySearchCriteria,
  PropertySort,
} from "@/domain/repositories/IPropertyRepository";
import { SearchProperties } from "@/application/use-cases/SearchProperties";
import { container } from "@/infrastructure/di/container";
import { SearchBar } from "@/presentation/components/search/SearchBar";
import { PropertyFilters } from "@/presentation/components/search/PropertyFilters";
import { SearchToolbar } from "@/presentation/components/search/SearchToolbar";
import { SearchResults } from "@/presentation/components/search/SearchResults";
import { ActiveFilters } from "@/presentation/components/search/ActiveFilters";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const parameters = await searchParams;
  const hasFilters = Object.values(parameters).some((value) => Array.isArray(value) ? value.length > 0 : Boolean(value));
  return {
    title: "Cari Tanah",
    description: "Temukan tanah pilihan untuk hunian, investasi, dan usaha di seluruh Indonesia.",
    alternates: { canonical: "/cari-tanah" },
    robots: hasFilters ? { index: false, follow: true } : { index: true, follow: true },
  };
}

const CERTIFICATES = ["SHM", "HGB", "HGU", "HP"] as const;
const BADGES = ["exclusive", "broker"] as const;
const SORTS: PropertySort[] = [
  "recommended",
  "price-asc",
  "price-desc",
  "area-asc",
  "area-desc",
];

function valuesFor(
  value: string | string[] | undefined,
  allowed: readonly string[],
): string[] {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return [...new Set(values.filter((item) => allowed.includes(item)))];
}

function positiveNumber(value: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function textValue(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim().slice(0, 120) ?? "";
}

export default async function SearchPropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const sortCandidate = textValue(params.sort) as PropertySort;
  const sort = SORTS.includes(sortCandidate) ? sortCandidate : "recommended";
  const criteria: PropertySearchCriteria = {
    query: textValue(params.q),
    certificates: valuesFor(params.certificate, CERTIFICATES) as PropertySearchCriteria["certificates"],
    badges: valuesFor(params.badge, BADGES) as PropertySearchCriteria["badges"],
    minPrice: positiveNumber(params.minPrice),
    maxPrice: positiveNumber(params.maxPrice),
    minArea: positiveNumber(params.minArea),
    maxArea: positiveNumber(params.maxArea),
    sort,
    page: Math.max(1, Math.floor(positiveNumber(params.page) ?? 1)),
    perPage: 6,
  };

  const searchProperties = new SearchProperties(container.propertyRepo);
  const result = await searchProperties.execute(criteria);

  return (
    <div className="min-h-screen bg-background pt-16 md:pt-20">
      <section className="border-b border-border-subtle bg-surface-container-low py-10 md:py-14">
        <div className="container-main">
          <p className="mb-2 text-label-sm font-label-sm uppercase tracking-wider text-primary">Eksplorasi properti</p>
          <h1 className="mb-3 text-3xl font-bold text-on-surface md:text-4xl">Cari Tanah Terbaik</h1>
          <p className="mb-7 max-w-2xl text-body-md text-on-surface-variant">Temukan tanah yang sesuai dengan rencana hunian, investasi, atau bisnis Anda.</p>
          <SearchBar initialQuery={criteria.query ?? ""} />
        </div>
      </section>

      <section className="container-main py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <PropertyFilters
              certificates={criteria.certificates ?? []}
              badges={criteria.badges ?? []}
              minPrice={criteria.minPrice}
              maxPrice={criteria.maxPrice}
              minArea={criteria.minArea}
              maxArea={criteria.maxArea}
            />
          </aside>
          <div>
            <ActiveFilters
              certificates={criteria.certificates ?? []}
              badges={criteria.badges ?? []}
              minPrice={criteria.minPrice}
              maxPrice={criteria.maxPrice}
              minArea={criteria.minArea}
              maxArea={criteria.maxArea}
            />
            <SearchToolbar total={result.total} page={result.page} totalPages={result.totalPages} sort={sort} />
            <div className="pt-6">
              <SearchResults properties={result.properties} salesMap={result.salesMap} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
