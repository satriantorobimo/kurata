import { MockPropertyRepository } from "../repositories/MockPropertyRepository";
import { MockStatisticRepository } from "../repositories/MockStatisticRepository";
import { MockBrokerApplicationRepository } from "../repositories/MockBrokerApplicationRepository";
import { MockServiceInquiryRepository } from "../repositories/MockServiceInquiryRepository";
import { MockInvestmentInquiryRepository } from "../repositories/MockInvestmentInquiryRepository";
import { MockBlogArticleRepository } from "../repositories/MockBlogArticleRepository";
import { MockSupportRequestRepository } from "../repositories/MockSupportRequestRepository";

/**
 * Simple Dependency Injection container.
 * Creates and caches singleton instances of all repositories.
 *
 * When moving to real APIs:
 *   1. Create ApiPropertyRepository implementing IPropertyRepository
 *   2. Swap the instance here — no other code changes needed.
 */
const propertyRepo = new MockPropertyRepository();
const statisticRepo = new MockStatisticRepository();
const brokerApplicationRepo = new MockBrokerApplicationRepository();
const serviceInquiryRepo = new MockServiceInquiryRepository();
const investmentInquiryRepo = new MockInvestmentInquiryRepository();
const blogArticleRepo = new MockBlogArticleRepository();
const supportRequestRepo = new MockSupportRequestRepository();

export const container = {
  propertyRepo,
  statisticRepo,
  brokerApplicationRepo,
  serviceInquiryRepo,
  investmentInquiryRepo,
  blogArticleRepo,
  supportRequestRepo,
};

export type Container = typeof container;
