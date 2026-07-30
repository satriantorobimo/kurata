export const SUPPORT_CATEGORIES = [
  "account-security",
  "search-listings",
  "listing-information",
  "investment",
  "broker-partner",
  "kurata-services",
  "privacy-data",
] as const;

export const SUPPORT_CONTACT_METHODS = ["email", "whatsapp"] as const;

export type SupportCategory = (typeof SUPPORT_CATEGORIES)[number];
export type SupportContactMethod = (typeof SUPPORT_CONTACT_METHODS)[number];

export interface SupportRequestProps {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  category: SupportCategory;
  subject: string;
  message: string;
  preferredContact: SupportContactMethod;
  acceptedTerms: true;
  createdAt: Date;
}

export class SupportRequest {
  private constructor(private readonly props: SupportRequestProps) {}

  static create(props: SupportRequestProps): SupportRequest {
    return new SupportRequest(props);
  }

  get id(): string {
    return this.props.id;
  }
}
