import { SupportRequest, type SupportRequestProps } from "../../domain/entities/SupportRequest";
import type { ISupportRequestRepository } from "../../domain/repositories/ISupportRequestRepository";

/** Development-only request storage. Replace with a ticketing system or CRM in production. */
export class MockSupportRequestRepository implements ISupportRequestRepository {
  private readonly requests: SupportRequest[] = [];

  async submit(request: SupportRequestProps): Promise<SupportRequest> {
    await new Promise((resolve) => setTimeout(resolve, 450));
    const created = SupportRequest.create(request);
    this.requests.push(created);
    return created;
  }
}
