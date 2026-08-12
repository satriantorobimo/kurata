import type { CmsSalesDetail, CmsSalesListItem, CmsSalesOption } from "../../../infrastructure/repositories/PostgresCmsRepository";

export class GetCmsSalesList {
  constructor(private readonly repository: { listSales(keyword: string): Promise<CmsSalesListItem[]> }) {}

  execute(keyword = ""): Promise<CmsSalesListItem[]> {
    return this.repository.listSales(keyword);
  }
}

export class GetCmsSalesDetail {
  constructor(private readonly repository: { getSalesById(id: string): Promise<CmsSalesDetail | null> }) {}

  execute(id: string): Promise<CmsSalesDetail | null> {
    return this.repository.getSalesById(id);
  }
}

export class GetCmsSalesOptions {
  constructor(private readonly repository: { listSalesOptions(): Promise<CmsSalesOption[]> }) {}

  execute(): Promise<CmsSalesOption[]> {
    return this.repository.listSalesOptions();
  }
}
