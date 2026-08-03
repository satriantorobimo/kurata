import { MockPropertyRepository } from "../repositories/MockPropertyRepository";
import { PostgresStatisticRepository } from "../repositories/PostgresStatisticRepository";
import { MockBrokerApplicationRepository } from "../repositories/MockBrokerApplicationRepository";
import { MockServiceInquiryRepository } from "../repositories/MockServiceInquiryRepository";
import { MockInvestmentInquiryRepository } from "../repositories/MockInvestmentInquiryRepository";
import { PostgresBlogArticleRepository } from "../repositories/PostgresBlogArticleRepository";
import { MockSupportRequestRepository } from "../repositories/MockSupportRequestRepository";

/**
 * Simple Dependency Injection container.
 * Creates and caches singleton instances of all repositories.
 *
 * Each repository can evolve independently while the application use cases
 * keep a stable interface.
 */
const propertyRepo = new MockPropertyRepository();
const statisticRepo = new PostgresStatisticRepository();
const brokerApplicationRepo = new MockBrokerApplicationRepository();
const serviceInquiryRepo = new MockServiceInquiryRepository();
const investmentInquiryRepo = new MockInvestmentInquiryRepository();
const blogArticleRepo = new PostgresBlogArticleRepository();
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
