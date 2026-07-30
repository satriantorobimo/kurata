import type { InvestmentInquiryProps } from "../../domain/entities/InvestmentInquiry";
import { InvestmentInquiry } from "../../domain/entities/InvestmentInquiry";
import type { IInvestmentInquiryRepository } from "../../domain/repositories/IInvestmentInquiryRepository";

/** Development-only storage. Replace with a secure CRM or database in production. */
export class MockInvestmentInquiryRepository implements IInvestmentInquiryRepository {
  private readonly inquiries: InvestmentInquiry[] = [];

  async submit(inquiry: InvestmentInquiryProps): Promise<InvestmentInquiry> {
    await new Promise((resolve) => setTimeout(resolve, 450));
    const created = InvestmentInquiry.create(inquiry);
    this.inquiries.push(created);
    return created;
  }
}
