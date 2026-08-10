import type { CmsContentSection, CmsStatistic } from "../../../infrastructure/repositories/PostgresCmsRepository";

/**
 * Use cases: retrieve content sections and site statistics for the CMS.
 */
export class GetCmsSectionList {
  constructor(private readonly repository: { listContentSections(): Promise<CmsContentSection[]> }) {}

  execute(): Promise<CmsContentSection[]> {
    return this.repository.listContentSections();
  }
}

export class GetCmsSectionDetail {
  constructor(private readonly repository: { getContentSection(id: string): Promise<CmsContentSection | null> }) {}

  execute(id: string): Promise<CmsContentSection | null> {
    return this.repository.getContentSection(id);
  }
}

export class GetCmsStatisticList {
  constructor(private readonly repository: { listStatistics(): Promise<CmsStatistic[]> }) {}

  execute(): Promise<CmsStatistic[]> {
    return this.repository.listStatistics();
  }
}

export class GetCmsStatisticDetail {
  constructor(private readonly repository: { getStatistic(id: string): Promise<CmsStatistic | null> }) {}

  execute(id: string): Promise<CmsStatistic | null> {
    return this.repository.getStatistic(id);
  }
}