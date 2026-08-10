import { GetCmsSectionList } from "@/application/use-cases/cms/GetCmsContent";
import { container } from "@/infrastructure/di/container";
import { InvestasiListPage } from "@/presentation/components/cms/investasi/InvestasiListPage";
import { getCmsAccess } from "../access";

export const dynamic = "force-dynamic";

export default async function CmsInvestasiPage() {
  const [{ canWrite }, allSections] = await Promise.all([getCmsAccess(), new GetCmsSectionList(container.cmsRepo).execute()]);

  const investasiSections = allSections.filter((section) => section.section === "investasi");

  return <InvestasiListPage sections={investasiSections} canWrite={canWrite} />;
}