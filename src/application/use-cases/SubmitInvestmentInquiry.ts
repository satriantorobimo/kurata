import type { InvestmentInquiryInput } from "../dto/InvestmentInquiryDTO";
import type { IInvestmentInquiryRepository } from "../../domain/repositories/IInvestmentInquiryRepository";

export class SubmitInvestmentInquiry {
  constructor(private readonly repository: IInvestmentInquiryRepository) {}

  async execute(input: InvestmentInquiryInput) {
    const reference = `INV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    return this.repository.submit({ ...input, id: reference, createdAt: new Date() });
  }
}
