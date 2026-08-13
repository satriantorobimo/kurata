import { HeroSection } from "@/presentation/components/home/HeroSection";
import { HighlightCards } from "@/presentation/components/home/HighlightCards";
import { StatisticsBar } from "@/presentation/components/home/StatisticsBar";
import { RecommendationSection } from "@/presentation/components/home/RecommendationSection";
import { ValueStrip } from "@/presentation/components/home/ValueStrip";
import { GetRecommendedProperties } from "@/application/use-cases/GetRecommendedProperties";
import { GetStatistics } from "@/application/use-cases/GetStatistics";
import { container } from "@/infrastructure/di/container";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const getProperties = new GetRecommendedProperties(container.propertyRepo);
  const getStats = new GetStatistics(container.statisticRepo);

  const [result, stats] = await Promise.all([
    getProperties.execute(),
    getStats.execute(),
  ]);

  return (
    <div className="flex w-full flex-col bg-background pt-16 md:pt-20">
      <HeroSection />
      <HighlightCards />
      <StatisticsBar stats={stats} />
      <RecommendationSection properties={result.properties} salesMap={result.salesMap} />
      <ValueStrip />
    </div>
  );
}
