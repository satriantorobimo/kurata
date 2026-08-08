import type { BrokerWorkspaceData } from "../../infrastructure/repositories/PostgresWorkspaceRepository";

/**
 * Use case: retrieve the authenticated broker's workspace data.
 */
export class GetBrokerWorkspace {
  constructor(private readonly repository: { getBrokerWorkspace(userId: string): Promise<BrokerWorkspaceData> }) {}

  async execute(userId: string): Promise<BrokerWorkspaceData> {
    return this.repository.getBrokerWorkspace(userId);
  }
}
