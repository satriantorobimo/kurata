import { Property } from "../entities/Property";
import { CertificateType, PropertyBadge } from "../entities/Property";
import { PropertyDetail } from "../entities/PropertyDetail";

export type PropertySort =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "area-asc"
  | "area-desc";

export type LandType = "common" | "business_potential";

export interface PropertySearchCriteria {
  query?: string;
  certificates?: CertificateType[];
  badges?: Exclude<PropertyBadge, null>[];
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  sort?: PropertySort;
  page?: number;
  perPage?: number;
  landType?: LandType;
}

export interface PropertySearchResult {
  properties: Property[];
  total: number;
  page: number;
  perPage: number;
  salesMap: Map<string, { name: string; phone: string; avatarUrl: string | null }>;
}

/**
 * Repository interface for property data.
 * Domain layer defines this — Infrastructure layer implements it.
 */
export interface IPropertyRepository {
  getRecommended(landType?: LandType): Promise<Property[]>;
  getById(id: string, landType?: LandType): Promise<PropertyDetail | null>;
  getRelated(id: string, limit: number, landType?: LandType): Promise<Property[]>;
  getAllIds(landType?: LandType): Promise<string[]>;
  search(criteria: PropertySearchCriteria): Promise<PropertySearchResult>;
}
