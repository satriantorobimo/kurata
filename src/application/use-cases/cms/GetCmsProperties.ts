import type { CmsBrokerOption, CmsProperty, CmsPropertyDetail, CmsPropertyImage } from "../../../infrastructure/repositories/PostgresCmsRepository";

/**
 * Use case: read property listings for the CMS.
 */
export class GetCmsPropertyList {
  constructor(private readonly repository: { listProperties(keyword: string, status: string): Promise<CmsProperty[]> }) {}

  execute(keyword = "", status = ""): Promise<CmsProperty[]> {
    return this.repository.listProperties(keyword, status);
  }
}

export class GetCmsPropertyDetail {
  constructor(private readonly repository: { getPropertyById(id: string): Promise<CmsPropertyDetail | null> }) {}

  execute(id: string): Promise<CmsPropertyDetail | null> {
    return this.repository.getPropertyById(id);
  }
}

export class GetCmsPropertyImages {
  constructor(private readonly repository: { listPropertyImages(propertyId: string): Promise<CmsPropertyImage[]> }) {}

  execute(propertyId: string): Promise<CmsPropertyImage[]> {
    return this.repository.listPropertyImages(propertyId);
  }
}

export class GetCmsBrokerOptions {
  constructor(private readonly repository: { listBrokerOptions(): Promise<CmsBrokerOption[]> }) {}

  execute(): Promise<CmsBrokerOption[]> {
    return this.repository.listBrokerOptions();
  }
}