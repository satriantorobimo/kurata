import { ServiceInquiry, ServiceInquiryProps } from "../entities/ServiceInquiry";

export interface IServiceInquiryRepository {
  submit(inquiry: ServiceInquiryProps): Promise<ServiceInquiry>;
}
