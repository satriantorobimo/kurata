import { GetCmsSectionList } from "@/application/use-cases/cms/GetCmsContent";
import { container } from "@/infrastructure/di/container";
import { SectionListPage } from "@/presentation/components/cms/SectionListPage";
import { getCmsAccess } from "../access";

export const dynamic = "force-dynamic";

export default async function CmsSectionsPage() {
  const [{ canWrite }, sections] = await Promise.all([getCmsAccess(), new GetCmsSectionList(container.cmsRepo).execute()]);

  return <SectionListPage initialData={sections} canWrite={canWrite} />;
}