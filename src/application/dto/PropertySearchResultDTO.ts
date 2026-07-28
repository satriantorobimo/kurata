import type { PropertyDTO } from "./PropertyDTO";

export interface PropertySearchResultDTO {
  properties: PropertyDTO[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
