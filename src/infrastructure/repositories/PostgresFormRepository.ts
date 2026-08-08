import "server-only";

import type { BrokerApplicationProps } from "../../domain/entities/BrokerApplication";
import { BrokerApplication } from "../../domain/entities/BrokerApplication";
import type { InvestmentInquiryProps } from "../../domain/entities/InvestmentInquiry";
import { InvestmentInquiry } from "../../domain/entities/InvestmentInquiry";
import type { ServiceInquiryProps } from "../../domain/entities/ServiceInquiry";
import { ServiceInquiry } from "../../domain/entities/ServiceInquiry";
import type { SupportRequestProps } from "../../domain/entities/SupportRequest";
import { SupportRequest } from "../../domain/entities/SupportRequest";
import type { IBrokerApplicationRepository } from "../../domain/repositories/IBrokerApplicationRepository";
import type { IInvestmentInquiryRepository } from "../../domain/repositories/IInvestmentInquiryRepository";
import type { IServiceInquiryRepository } from "../../domain/repositories/IServiceInquiryRepository";
import type { ISupportRequestRepository } from "../../domain/repositories/ISupportRequestRepository";
import { getDatabase } from "../database/client";
import { forms } from "../database/schema";

type FormRowPayload = Record<string, unknown>;

interface FormRecord {
  id: string;
  formType: string;
  fullName: string;
  email: string;
  phone: string | null;
  payload: FormRowPayload;
  acceptedTerms: boolean;
}

/** All user-submitted forms persisted to the content schema. */
export class PostgresFormRepository
  implements
    IBrokerApplicationRepository,
    IServiceInquiryRepository,
    IInvestmentInquiryRepository,
    ISupportRequestRepository
{
  async submit(application: BrokerApplicationProps): Promise<BrokerApplication>;
  async submit(inquiry: ServiceInquiryProps): Promise<ServiceInquiry>;
  async submit(inquiry: InvestmentInquiryProps): Promise<InvestmentInquiry>;
  async submit(request: SupportRequestProps): Promise<SupportRequest>;
  async submit(
    form:
      | BrokerApplicationProps
      | ServiceInquiryProps
      | InvestmentInquiryProps
      | SupportRequestProps,
  ): Promise<BrokerApplication | ServiceInquiry | InvestmentInquiry | SupportRequest> {
    const { fullName, email, phone, acceptedTerms, ...payload } = form;

    const record: FormRecord = {
      id: form.id,
      formType: this.detectFormType(form),
      fullName,
      email,
      phone: phone ?? null,
      payload: { ...payload, acceptedTerms },
      acceptedTerms,
    };

    await getDatabase().insert(forms).values(record);

    return this.rehydrate(form);
  }

  private detectFormType(
    form:
      | BrokerApplicationProps
      | ServiceInquiryProps
      | InvestmentInquiryProps
      | SupportRequestProps,
  ): string {
    if ("brokerType" in form && "specializations" in form) return "broker_application";
    if ("role" in form && "service" in form) return "service_inquiry";
    if ("objective" in form && "horizon" in form) return "investment_inquiry";
    if ("category" in form && "subject" in form) return "support_request";
    throw new Error("Unknown form type.");
  }

  private rehydrate(
    form:
      | BrokerApplicationProps
      | ServiceInquiryProps
      | InvestmentInquiryProps
      | SupportRequestProps,
  ): BrokerApplication | ServiceInquiry | InvestmentInquiry | SupportRequest {
    if ("brokerType" in form) return BrokerApplication.create(form);
    if ("role" in form) return ServiceInquiry.create(form);
    if ("objective" in form) return InvestmentInquiry.create(form);
    return SupportRequest.create(form);
  }
}
