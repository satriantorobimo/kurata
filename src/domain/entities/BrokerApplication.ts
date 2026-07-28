export const BROKER_SPECIALIZATIONS = [
  "residential-land",
  "commercial-land",
  "agricultural-land",
  "industrial-land",
] as const;

export const BROKER_EXPERIENCE_LEVELS = [
  "less-than-1-year",
  "1-to-3-years",
  "3-to-5-years",
  "more-than-5-years",
] as const;

export const BROKER_TYPES = ["independent", "agency"] as const;

export type BrokerSpecialization = (typeof BROKER_SPECIALIZATIONS)[number];
export type BrokerExperienceLevel = (typeof BROKER_EXPERIENCE_LEVELS)[number];
export type BrokerType = (typeof BROKER_TYPES)[number];

export interface BrokerApplicationProps {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  operatingAreas: string;
  experienceLevel: BrokerExperienceLevel;
  brokerType: BrokerType;
  specializations: BrokerSpecialization[];
  companyName?: string;
  portfolioUrl?: string;
  message?: string;
  acceptedTerms: true;
  createdAt: Date;
}

export class BrokerApplication {
  private constructor(private readonly props: BrokerApplicationProps) {}

  static create(props: BrokerApplicationProps): BrokerApplication {
    return new BrokerApplication(props);
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }
}
