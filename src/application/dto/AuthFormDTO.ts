export type AuthField =
  | "fullName"
  | "email"
  | "phone"
  | "password"
  | "confirmPassword"
  | "acceptedTerms";

export interface AuthFormState {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<AuthField, string>>;
}

export const INITIAL_AUTH_FORM_STATE: AuthFormState = { status: "idle" };
