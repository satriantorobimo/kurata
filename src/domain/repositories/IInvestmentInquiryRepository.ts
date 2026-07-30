import type { InvestmentInquiry, InvestmentInquiryProps } from "../entities/InvestmentInquiry";

export interface IInvestmentInquiryRepository {
  submit(inquiry: InvestmentInquiryProps): Promise<InvestmentInquiry>;
}
