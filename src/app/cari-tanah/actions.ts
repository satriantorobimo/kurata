"use server";

import { requireAuthenticatedUser } from "@/infrastructure/security/authorization-dal";
import { container } from "@/infrastructure/di/container";

export interface FavoriteActionResult {
  ok: boolean;
  isFavorite: boolean;
  message?: string;
}

export async function toggleFavorite(propertyId: string): Promise<FavoriteActionResult> {
  const auth = await requireAuthenticatedUser();

  const repository = container.workspaceRepo;
  const isFavorite = await repository.isFavorited(auth.userId, propertyId);

  if (isFavorite) {
    await repository.removeFavorite(auth.userId, propertyId);
    return { ok: true, isFavorite: false };
  }

  await repository.addFavorite(auth.userId, propertyId);
  return { ok: true, isFavorite: true };
}
