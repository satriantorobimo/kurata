import { Property } from "../entities/Property";
import { CertificateType, PropertyBadge } from "../entities/Property";
import { PropertyDetail } from "../entities/PropertyDetail";

export type PropertySort =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "area-asc"
  | "area-desc";

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
}

export interface PropertySearchResult {
  properties: Property[];
  total: number;
  page: number;
  perPage: number;
}

/**
 * Repository interface for property data.
 * Domain layer defines this — Infrastructure layer implements it.
 */
export interface IPropertyRepository {
  getRecommended(): Promise<Property[]>;
  getById(id: string): Promise<PropertyDetail | null>;
  getRelated(id: string, limit: number): Promise<Property[]>;
  getAllIds(): Promise<string[]>;
  search(criteria: PropertySearchCriteria): Promise<PropertySearchResult>;
}
