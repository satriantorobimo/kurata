import type { CmsDashboardData } from "../../../infrastructure/repositories/PostgresCmsRepository";

/**
 * Use case: retrieve summary figures shown on the CMS dashboard.
 */
export class GetCmsDashboard {
  constructor(private readonly repository: { getDashboardData(): Promise<CmsDashboardData> }) {}

  execute(): Promise<CmsDashboardData> {
    return this.repository.getDashboardData();
  }
}