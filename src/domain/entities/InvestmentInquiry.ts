export const INVESTMENT_OBJECTIVES = [
  "capital-appreciation",
  "development",
  "land-banking",
  "diversification",
] as const;

export const INVESTMENT_HORIZONS = [
  "less-than-1-year",
  "1-to-3-years",
  "3-to-5-years",
  "more-than-5-years",
] as const;

export const INVESTMENT_PROPERTY_PREFERENCES = [
  "residential-land",
  "commercial-land",
  "industrial-land",
  "agricultural-land",
  "still-exploring",
] as const;

export type InvestmentObjective = (typeof INVESTMENT_OBJECTIVES)[number];
export type InvestmentHorizon = (typeof INVESTMENT_HORIZONS)[number];
export type InvestmentPropertyPreference = (typeof INVESTMENT_PROPERTY_PREFERENCES)[number];

export interface InvestmentInquiryProps {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  area: string;
  budget: string;
  objective: InvestmentObjective;
  horizon: InvestmentHorizon;
  propertyPreference: InvestmentPropertyPreference;
  notes?: string;
  acceptedTerms: true;
  createdAt: Date;
}

export class InvestmentInquiry {
  private constructor(private readonly props: InvestmentInquiryProps) {}

  static create(props: InvestmentInquiryProps): InvestmentInquiry {
    return new InvestmentInquiry(props);
  }

  get id(): string {
    return this.props.id;
  }
}
