import { GetCmsUserList } from "@/application/use-cases/cms/GetCmsUsers";
import { container } from "@/infrastructure/di/container";
import { UserListPage } from "@/presentation/components/cms/UserListPage";
import { getCmsAccess } from "../access";

export const dynamic = "force-dynamic";

export default async function CmsUsersPage() {
  const [{ canWrite }, users] = await Promise.all([getCmsAccess(), new GetCmsUserList(container.cmsRepo).execute()]);

  return <UserListPage initialData={users} canWrite={canWrite} />;
}