import type { UserProfileData } from "../../infrastructure/repositories/PostgresWorkspaceRepository";

/**
 * Use case: retrieve the authenticated user's profile.
 */
export class GetUserProfile {
  constructor(private readonly repository: { getUserProfile(userId: string): Promise<UserProfileData> }) {}

  async execute(userId: string): Promise<UserProfileData> {
    return this.repository.getUserProfile(userId);
  }
}
