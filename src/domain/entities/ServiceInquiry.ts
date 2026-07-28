export const SERVICE_TYPES = [
  "property-search",
  "initial-information-review",
  "indicative-price-estimate",
  "property-marketing",
  "broker-connection",
  "transaction-guidance",
] as const;

export const INQUIRY_ROLES = ["owner", "buyer", "investor", "broker"] as const;
export const PREFERRED_CONTACT_METHODS = ["whatsapp", "email"] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];
export type InquiryRole = (typeof INQUIRY_ROLES)[number];
export type PreferredContactMethod = (typeof PREFERRED_CONTACT_METHODS)[number];

export interface ServiceInquiryProps {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: InquiryRole;
  service: ServiceType;
  area: string;
  description: string;
  preferredContact: PreferredContactMethod;
  budget?: string;
  listingUrl?: string;
  acceptedTerms: true;
  createdAt: Date;
}

export class ServiceInquiry {
  private constructor(private readonly props: ServiceInquiryProps) {}

  static create(props: ServiceInquiryProps): ServiceInquiry {
    return new ServiceInquiry(props);
  }

  get id(): string {
    return this.props.id;
  }
}
