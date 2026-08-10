import type { CmsForm } from "../../../infrastructure/repositories/PostgresCmsRepository";

/**
 * Use cases: retrieve form submissions for the CMS.
 */
export class GetCmsFormList {
  constructor(private readonly repository: { listForms(formType: string, status: string, keyword: string): Promise<CmsForm[]> }) {}

  execute(formType = "", status = "", keyword = ""): Promise<CmsForm[]> {
    return this.repository.listForms(formType, status, keyword);
  }
}

export class GetCmsFormDetail {
  constructor(private readonly repository: { getFormById(id: string): Promise<CmsForm | null> }) {}

  execute(id: string): Promise<CmsForm | null> {
    return this.repository.getFormById(id);
  }
}