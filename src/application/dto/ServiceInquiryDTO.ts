import type {
  InquiryRole,
  PreferredContactMethod,
  ServiceType,
} from "../../domain/entities/ServiceInquiry";

export interface ServiceInquiryInput {
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
}

export type ServiceInquiryField =
  | "fullName"
  | "email"
  | "phone"
  | "role"
  | "service"
  | "area"
  | "description"
  | "preferredContact"
  | "listingUrl"
  | "acceptedTerms";

export interface ServiceInquiryFormState {
  status: "idle" | "error" | "success";
  message: string;
  reference?: string;
  fieldErrors?: Partial<Record<ServiceInquiryField, string>>;
}

export const INITIAL_SERVICE_INQUIRY_STATE: ServiceInquiryFormState = {
  status: "idle",
  message: "",
};
