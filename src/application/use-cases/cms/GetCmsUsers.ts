import type { CmsUserDetail, CmsUserListItem } from "../../../infrastructure/repositories/PostgresCmsRepository";

/**
 * Use cases: retrieve user accounts for the CMS.
 */
export class GetCmsUserList {
  constructor(private readonly repository: { listUsers(keyword: string, role: string, status: string): Promise<CmsUserListItem[]> }) {}

  execute(keyword = "", role = "", status = ""): Promise<CmsUserListItem[]> {
    return this.repository.listUsers(keyword, role, status);
  }
}

export class GetCmsUserDetail {
  constructor(private readonly repository: { getUserById(id: string): Promise<CmsUserDetail | null> }) {}

  execute(id: string): Promise<CmsUserDetail | null> {
    return this.repository.getUserById(id);
  }
}