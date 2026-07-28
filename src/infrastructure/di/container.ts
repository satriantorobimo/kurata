import { MockPropertyRepository } from "../repositories/MockPropertyRepository";
import { MockStatisticRepository } from "../repositories/MockStatisticRepository";
import { MockBrokerApplicationRepository } from "../repositories/MockBrokerApplicationRepository";
import { MockServiceInquiryRepository } from "../repositories/MockServiceInquiryRepository";

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

export const container = {
  propertyRepo,
  statisticRepo,
  brokerApplicationRepo,
  serviceInquiryRepo,
};

export type Container = typeof container;
