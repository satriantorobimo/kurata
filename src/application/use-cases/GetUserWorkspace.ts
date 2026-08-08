import type { UserWorkspaceData } from "../../infrastructure/repositories/PostgresWorkspaceRepository";

/**
 * Use case: retrieve the authenticated user's workspace data.
 */
export class GetUserWorkspace {
  constructor(private readonly repository: { getUserWorkspace(userId: string, email: string): Promise<UserWorkspaceData> }) {}

  async execute(userId: string, email: string): Promise<UserWorkspaceData> {
    return this.repository.getUserWorkspace(userId, email);
  }
}
