import type { VerificationStatus } from "@/infrastructure/repositories/PostgresWorkspaceRepository";

export type VerificationField = "nik" | "fullName" | "birthPlace" | "birthDate" | "address" | "agreement";

export interface VerificationFormState {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<VerificationField, string>>;
}

export const INITIAL_VERIFICATION_FORM_STATE: VerificationFormState = { status: "idle" };

export interface VerificationInput {
  userId: string;
  nik: string;
  fullName: string;
  birthPlace: string;
  birthDate: string;
  address: string;
}

export type { VerificationStatus };
