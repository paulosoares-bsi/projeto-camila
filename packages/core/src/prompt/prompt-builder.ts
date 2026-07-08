import type { MessageRecord } from "../database/message-repository.js";
import type { LeadRecord } from "../database/lead-repository.js";
import type { TenantContext } from "../tenants/tenant-loader.js";

export interface PromptBuilderInput {
  tenant: TenantContext;
  lead: LeadRecord;
  conversationHistory: MessageRecord[];
  currentMessage: string;
}

export class PromptBuilder {
  build(context: PromptBuilderInput): string {
    const history = context.conversationHistory
      .map((message) => `${message.direction === "inbound" ? "Cliente" : "Camila"}:\n${message.text}`)
      .join("\n\n");

    return [
      "# Persona",
      "",
      context.tenant.config.name,
      "",
      "# Objetivo",
      "",
      "Responder como a Camila Quinderé.",
      "",
      "# Estado do Lead",
      "",
      context.lead.currentState,
      "",
      "# Histórico",
      "",
      history,
      "",
      "# Mensagem Atual",
      "",
      context.currentMessage,
      "",
      "# Instrução",
      "",
      "Responda de forma objetiva, acolhedora e comercial.",
    ].join("\n");
  }
}
