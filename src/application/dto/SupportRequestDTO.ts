import type { SupportCategory, SupportContactMethod } from "../../domain/entities/SupportRequest";

export interface SupportRequestInput {
  fullName: string;
  email: string;
  phone?: string;
  category: SupportCategory;
  subject: string;
  message: string;
  preferredContact: SupportContactMethod;
  acceptedTerms: true;
}

export type SupportRequestField = "fullName" | "email" | "phone" | "category" | "subject" | "message" | "preferredContact" | "acceptedTerms";

export interface SupportRequestFormState {
  status: "idle" | "error" | "success";
  message: string;
  reference?: string;
  fieldErrors?: Partial<Record<SupportRequestField, string>>;
}

export const INITIAL_SUPPORT_REQUEST_STATE: SupportRequestFormState = { status: "idle", message: "" };
