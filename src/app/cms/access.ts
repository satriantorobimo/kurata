import "server-only";

import { getCurrentAuthContext } from "@/infrastructure/security/authorization-dal";

export interface CmsAccess {
  canWrite: boolean;
}

/**
 * CMS access derived from the current auth context.
 * View is granted to admins/super admins (layout gate); writes need super_admin.
 */
export async function getCmsAccess(): Promise<CmsAccess> {
  const auth = await getCurrentAuthContext();
  return { canWrite: auth?.role === "super_admin" };
}