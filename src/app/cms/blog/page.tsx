import { GetCmsBlogList } from "@/application/use-cases/cms/GetCmsBlog";
import { container } from "@/infrastructure/di/container";
import { BlogListPage } from "@/presentation/components/cms/BlogListPage";
import { getCmsAccess } from "../access";

export const dynamic = "force-dynamic";

export default async function CmsBlogPage() {
  const [{ canWrite }, articles] = await Promise.all([getCmsAccess(), new GetCmsBlogList(container.cmsRepo).execute()]);

  return <BlogListPage initialData={articles} canWrite={canWrite} />;
}