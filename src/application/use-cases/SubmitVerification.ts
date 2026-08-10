import type { VerificationInput } from "../dto/VerificationFormDTO";

export interface VerificationSubmissionResult {
  status: string;
}

export class SubmitVerification {
  constructor(
    private readonly repository: {
      submitVerification(input: VerificationInput): Promise<VerificationSubmissionResult>;
    },
  ) {}

  async execute(input: VerificationInput): Promise<VerificationSubmissionResult> {
    return this.repository.submitVerification(input);
  }
}
