import type { PropertyDTO } from "./PropertyDTO";

export interface PropertySearchResultDTO {
  properties: PropertyDTO[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  salesMap: Map<string, { name: string; phone: string; avatarUrl: string | null }>;
}
