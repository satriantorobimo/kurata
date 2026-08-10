import { PostgresPropertyRepository } from "../repositories/PostgresPropertyRepository";
import { PostgresStatisticRepository } from "../repositories/PostgresStatisticRepository";
import { PostgresFormRepository } from "../repositories/PostgresFormRepository";
import { PostgresBlogArticleRepository } from "../repositories/PostgresBlogArticleRepository";
import { PostgresContentSectionRepository } from "../repositories/PostgresContentSectionRepository";
import { PostgresAdminRepository } from "../repositories/PostgresAdminRepository";
import { PostgresWorkspaceRepository } from "../repositories/PostgresWorkspaceRepository";
import { PostgresCmsRepository } from "../repositories/PostgresCmsRepository";

/**
 * Simple Dependency Injection container.
 * Creates and caches singleton instances of all repositories.
 *
 * Each repository can evolve independently while the application use cases
 * keep a stable interface.
 */
const propertyRepo = new PostgresPropertyRepository();
const statisticRepo = new PostgresStatisticRepository();
const brokerApplicationRepo = new PostgresFormRepository();
const serviceInquiryRepo = new PostgresFormRepository();
const investmentInquiryRepo = new PostgresFormRepository();
const blogArticleRepo = new PostgresBlogArticleRepository();
const supportRequestRepo = new PostgresFormRepository();
const contentSectionRepo = new PostgresContentSectionRepository();
const adminRepo = new PostgresAdminRepository();
const workspaceRepo = new PostgresWorkspaceRepository();
const cmsRepo = new PostgresCmsRepository();

export const container = {
  propertyRepo,
  statisticRepo,
  brokerApplicationRepo,
  serviceInquiryRepo,
  investmentInquiryRepo,
  blogArticleRepo,
  supportRequestRepo,
  contentSectionRepo,
  adminRepo,
  workspaceRepo,
  cmsRepo,
};

export type Container = typeof container;
