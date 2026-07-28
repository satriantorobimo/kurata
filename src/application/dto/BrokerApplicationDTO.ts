import type {
  BrokerExperienceLevel,
  BrokerSpecialization,
  BrokerType,
} from "../../domain/entities/BrokerApplication";

export interface BrokerApplicationInput {
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
}

export type BrokerApplicationField =
  | "fullName"
  | "email"
  | "phone"
  | "city"
  | "operatingAreas"
  | "experienceLevel"
  | "brokerType"
  | "specializations"
  | "portfolioUrl"
  | "acceptedTerms";

export interface BrokerApplicationFormState {
  status: "idle" | "error" | "success";
  message: string;
  reference?: string;
  fieldErrors?: Partial<Record<BrokerApplicationField, string>>;
}

export const INITIAL_BROKER_APPLICATION_STATE: BrokerApplicationFormState = {
  status: "idle",
  message: "",
};
