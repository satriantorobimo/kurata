import { GetCmsSalesList } from "@/application/use-cases/cms/GetCmsSales";
import { container } from "@/infrastructure/di/container";
import { SalesListPage } from "@/presentation/components/cms/SalesListPage";
import { getCmsAccess } from "../access";

export const dynamic = "force-dynamic";

export default async function CmsSalesPage() {
  const [{ canWrite }, sales] = await Promise.all([getCmsAccess(), new GetCmsSalesList(container.cmsRepo).execute()]);

  return <SalesListPage initialData={sales} canWrite={canWrite} />;
}
