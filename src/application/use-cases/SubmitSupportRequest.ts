import type { SupportRequestInput } from "../dto/SupportRequestDTO";
import type { ISupportRequestRepository } from "../../domain/repositories/ISupportRequestRepository";

export class SubmitSupportRequest {
  constructor(private readonly repository: ISupportRequestRepository) {}

  async execute(input: SupportRequestInput) {
    const id = `SUP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    return this.repository.submit({ ...input, id, createdAt: new Date() });
  }
}
