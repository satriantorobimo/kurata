import { GetCmsStatisticList } from "@/application/use-cases/cms/GetCmsContent";
import { container } from "@/infrastructure/di/container";
import { StatisticListPage } from "@/presentation/components/cms/StatisticListPage";
import { getCmsAccess } from "../access";

export const dynamic = "force-dynamic";

export default async function CmsStatisticsPage() {
  const [{ canWrite }, statistics] = await Promise.all([getCmsAccess(), new GetCmsStatisticList(container.cmsRepo).execute()]);

  return <StatisticListPage initialData={statistics} canWrite={canWrite} />;
}