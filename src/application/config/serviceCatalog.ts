import type { ServiceType } from "../../domain/entities/ServiceInquiry";

export interface ServiceDefinition {
  id: ServiceType;
  title: string;
  shortTitle: string;
  description: string;
  audience: string;
  deliverables: string[];
  disclaimer?: string;
}
