import { ServiceInquiry, ServiceInquiryProps } from "../../domain/entities/ServiceInquiry";
import { IServiceInquiryRepository } from "../../domain/repositories/IServiceInquiryRepository";

/** Development-only inquiry storage. Replace with a CRM or database in production. */
export class MockServiceInquiryRepository implements IServiceInquiryRepository {
  private readonly inquiries: ServiceInquiry[] = [];

  async submit(inquiry: ServiceInquiryProps): Promise<ServiceInquiry> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const created = ServiceInquiry.create(inquiry);
    this.inquiries.push(created);
    return created;
  }
}
