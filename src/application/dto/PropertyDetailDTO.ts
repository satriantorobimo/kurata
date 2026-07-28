import type { PropertyDTO } from "./PropertyDTO";

export interface PropertyDetailDTO extends PropertyDTO {
  description: string;
  imageUrls: string[];
  dimensions: string;
  zoning: string;
  roadAccess: string;
  legalStatus: string;
  address: string;
  facilities: string[];
  listedAt: string;
  contactLabel: string;
}
