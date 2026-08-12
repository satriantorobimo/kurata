import { Property } from "./Property";

export interface PropertyDetail {
  property: Property;
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
  brokerName: string | null;
  brokerCity: string | null;
  brokerPhone: string | null;
  brokerAvatarKey: string | null;
  salesName: string | null;
  salesPhone: string | null;
  salesAvatarUrl: string | null;
}
