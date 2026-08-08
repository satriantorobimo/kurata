import type { IContentSectionRepository } from "../../domain/repositories/IContentSectionRepository";

export interface InvestasiCategory {
  icon: string;
  label: string;
}

export interface InvestasiListing {
  title: string;
  location: string;
  area: string;
  price: string;
  imageUrl: string;
}

export interface InvestasiFeature {
  icon: string;
  label: string;
}

export interface InvestasiAreaAnalysisItem {
  label: string;
  rating: number;
}

export interface InvestasiInfrastructureItem {
  label: string;
  distance: string;
}

export interface InvestasiSimilarListing {
  title: string;
  location: string;
  price: string;
  imageUrl: string;
}

export interface InvestasiScoreMetric {
  label: string;
  score: number;
}

export interface InvestasiBroker {
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  imagePath: string;
}

export interface InvestasiContent {
  categories: InvestasiCategory[];
  listings: InvestasiListing[];
  features: InvestasiFeature[];
  opportunities: string[];
  areaAnalysis: InvestasiAreaAnalysisItem[];
  infrastructure: InvestasiInfrastructureItem[];
  similarListings: InvestasiSimilarListing[];
  scoreMetrics: InvestasiScoreMetric[];
  broker: InvestasiBroker | null;
  score: number;
  insightTitle: string;
  insightDescription: string;
}

/**
 * Use case: Retrieve the Potensi Lahan page content from the content store.
 */
export class GetInvestasiContent {
  constructor(private readonly repository: IContentSectionRepository) {}

  async execute(): Promise<InvestasiContent> {
    const rows = await this.repository.getBySection("investasi");
    const byId = new Map(rows.map((row) => [row.id, row.content]));

    const read = <T>(id: string, fallback: T): T => {
      const content = byId.get(id);
      if (content === undefined) return fallback;
      return content as T;
    };

    const categories = read<InvestasiCategory[]>("investasi-categories", []);
    const listings = read<InvestasiListing[]>("investasi-listings", []);
    const features = read<InvestasiFeature[]>("investasi-features", []);
    const opportunities = read<string[]>("investasi-opportunities", []);
    const areaAnalysis = read<InvestasiAreaAnalysisItem[]>("investasi-area-analysis", []);
    const infrastructure = read<InvestasiInfrastructureItem[]>("investasi-infrastructure", []);
    const similarListings = read<InvestasiSimilarListing[]>("investasi-similar", []);
    const scoreMetrics = read<InvestasiScoreMetric[]>("investasi-score-metrics", []);
    const broker = read<InvestasiBroker | null>("investasi-broker", null);

    const score =
      scoreMetrics.length > 0
        ? Math.round((scoreMetrics.reduce((sum, item) => sum + item.score, 0) / scoreMetrics.length) * 10) / 10
        : 0;

    return {
      categories,
      listings,
      features,
      opportunities,
      areaAnalysis,
      infrastructure,
      similarListings,
      scoreMetrics,
      broker,
      score,
      insightTitle: "Peluang Tinggi di Koridor Tol Jakarta–Cikampek",
      insightDescription:
        "Berdasarkan analisis kami, lahan di koridor ini dilintasi hingga 120.000 kendaraan per hari, ditunjang akses tol ganda dan pertumbuhan kawasan industri. Kombinasi ini menjadikannya lokasi ideal untuk pembangunan SPBU.",
    };
  }
}
