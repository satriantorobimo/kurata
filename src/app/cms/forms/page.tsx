import { GetCmsFormList } from "@/application/use-cases/cms/GetCmsForms";
import { container } from "@/infrastructure/di/container";
import { FormListPage } from "@/presentation/components/cms/FormListPage";

export const dynamic = "force-dynamic";

export default async function CmsFormsPage() {
  const forms = await new GetCmsFormList(container.cmsRepo).execute();

  return <FormListPage initialData={forms} />;
}