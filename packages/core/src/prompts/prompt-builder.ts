import type { PlatformEvent } from "../events/types.js";
import type { TenantContext } from "../tenants/tenant-loader.js";

export interface PromptContextInput {
  tenant: TenantContext;
  event: PlatformEvent;
  state: string;
  playbookId?: string;
  appliedRuleIds: string[];
}

export function buildRuntimeContext(input: PromptContextInput): string {
  return [
    `Tenant: ${input.tenant.config.name} (${input.tenant.config.id})`,
    `Estado atual: ${input.state}`,
    `Evento atual: ${input.event.type}`,
    `Playbook em execucao: ${input.playbookId ?? "nenhum"}`,
    `Business Rules aplicadas: ${input.appliedRuleIds.join(", ") || "nenhuma"}`,
    "",
    "Knowledge Master:",
    input.tenant.knowledge,
  ].join("\n");
}
