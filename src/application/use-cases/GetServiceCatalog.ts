import type { IContentSectionRepository } from "../../domain/repositories/IContentSectionRepository";
import { SERVICE_TYPES, type ServiceType } from "../../domain/entities/ServiceInquiry";
import type { ServiceDefinition } from "../config/serviceCatalog";

function isServiceType(value: string): value is ServiceType {
  return (SERVICE_TYPES as readonly string[]).includes(value);
}

/**
 * Use case: Retrieve the service catalog from the content store.
 */
export class GetServiceCatalog {
  constructor(private readonly repository: IContentSectionRepository) {}

  async execute(): Promise<ServiceDefinition[]> {
    const sections = await this.repository.getBySection("services");
    const definitions: ServiceDefinition[] = [];

    for (const section of sections) {
      const data = section.content as Record<string, unknown>;
      const id = String(data.id);
      if (!isServiceType(id)) continue;

      definitions.push({
        id,
        title: String(data.title),
        shortTitle: String(data.shortTitle),
        description: String(data.description),
        audience: String(data.audience),
        deliverables: Array.isArray(data.deliverables) ? data.deliverables.map(String) : [],
        disclaimer: typeof data.disclaimer === "string" ? data.disclaimer : undefined,
      });
    }

    return definitions;
  }
}
