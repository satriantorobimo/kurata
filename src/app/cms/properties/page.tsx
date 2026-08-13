import { GetCmsPropertyList } from "@/application/use-cases/cms/GetCmsProperties";
import { container } from "@/infrastructure/di/container";
import { PropertyListPage } from "@/presentation/components/cms/PropertyListPage";
import { getCmsAccess } from "../access";

export const dynamic = "force-dynamic";

export default async function CmsPropertiesPage() {
  const [{ canWrite }, properties] = await Promise.all([getCmsAccess(), new GetCmsPropertyList(container.cmsRepo).execute("", "", "common")]);

  return <PropertyListPage initialData={properties} canWrite={canWrite} />;
}
