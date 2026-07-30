import type { InvestmentHorizon, InvestmentObjective, InvestmentPropertyPreference } from "../../domain/entities/InvestmentInquiry";

export interface InvestmentInquiryInput {
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
}

export type InvestmentInquiryField = "fullName" | "email" | "phone" | "area" | "budget" | "objective" | "horizon" | "propertyPreference" | "notes" | "acceptedTerms";

export interface InvestmentInquiryFormState {
  status: "idle" | "error" | "success";
  message: string;
  reference?: string;
  fieldErrors?: Partial<Record<InvestmentInquiryField, string>>;
}

export const INITIAL_INVESTMENT_INQUIRY_STATE: InvestmentInquiryFormState = { status: "idle", message: "" };
