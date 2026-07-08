import type { PlatformConfig } from "../config/types.js";
import type { PlatformEvent, IncomingMessagePayload } from "./types.js";
import type { AIProvider } from "../providers/ai/types.js";
import type { WhatsAppProvider } from "../providers/whatsapp/types.js";
import { PromptBuilder } from "../prompt/prompt-builder.js";
import { evaluateRules } from "../rules/rules-engine.js";
import { loadTenantContext } from "../tenants/tenant-loader.js";
import type { EventStore } from "../database/event-store.js";
import type { HotmartRepository } from "../database/hotmart-repository.js";
import type { LeadRepository } from "../database/lead-repository.js";
import type { MessageRepository } from "../database/message-repository.js";

export interface EventProcessorDependencies {
  rootDir: string;
  platformConfig: PlatformConfig;
  aiProvider: AIProvider;
  whatsAppProvider: WhatsAppProvider;
  eventStore?: EventStore;
  hotmartRepository?: HotmartRepository;
  leadRepository?: LeadRepository;
  messageRepository?: MessageRepository;
}

export class EventProcessor {
  constructor(private readonly deps: EventProcessorDependencies) {}

  private readonly promptBuilder = new PromptBuilder();

  async process(event: PlatformEvent): Promise<void> {
    const tenant = loadTenantContext(this.deps.rootDir, event.tenantId);
    const decision = evaluateRules(event);

    if (event.type !== "MESSAGE_RECEIVED") {
      await this.deps.eventStore?.append(event, "received");
      if (event.source === "hotmart") {
        await this.deps.hotmartRepository?.persistEvent(event);
      }
      await this.deps.eventStore?.updateStatus(event.id, "processed");
      await this.deps.eventStore?.append({ ...event, id: `${event.id}:processed` }, "processed");
      return;
    }

    const payload = event.payload as unknown as IncomingMessagePayload;
    const lead = await this.deps.leadRepository?.upsertByExternalContact({
      tenantId: event.tenantId,
      externalContactId: payload.externalContactId,
      currentState: decision.nextState,
    });
    const leadId = lead?.id ?? event.leadId;
    const eventWithLead = { ...event, leadId };

    await this.deps.eventStore?.append(eventWithLead, "received");
    if (leadId) {
      await this.deps.messageRepository?.create({
        tenantId: event.tenantId,
        leadId,
        direction: "inbound",
        channel: payload.channel,
        externalMessageId: payload.messageId,
        text: payload.text,
      });
    }

    const conversationHistory = leadId
      ? await this.deps.messageRepository?.listRecentByLead({
          tenantId: event.tenantId,
          leadId,
          limit: 20,
          excludeExternalMessageId: payload.messageId,
        })
      : [];
    const prompt = this.promptBuilder.build({
      tenant,
      lead: lead ?? {
        id: leadId ?? "",
        tenantId: event.tenantId,
        externalContactId: payload.externalContactId,
        currentState: decision.nextState,
      },
      conversationHistory: conversationHistory ?? [],
      currentMessage: payload.text,
    });

    const aiResponse = await this.deps.aiProvider.generateResponse({
      tenantId: event.tenantId,
      prompt,
      systemPrompt: tenant.systemPrompt,
      context: prompt,
      userMessage: payload.text,
    });

    const instance =
      tenant.config.providers?.whatsapp?.instance ??
      this.deps.platformConfig.providers.whatsapp.defaultInstance ??
      event.tenantId;

    await this.deps.whatsAppProvider.sendMessage({
      tenantId: event.tenantId,
      instance,
      to: payload.externalContactId,
      text: aiResponse.text,
    });

    if (leadId) {
      await this.deps.messageRepository?.create({
        tenantId: event.tenantId,
        leadId,
        direction: "outbound",
        channel: payload.channel,
        externalMessageId: `${payload.messageId}:response`,
        text: aiResponse.text,
      });
    }

    await this.deps.eventStore?.append(
      {
        id: `${event.id}:message-sent`,
        type: "MESSAGE_SENT",
        tenantId: event.tenantId,
        leadId,
        source: aiResponse.provider,
        occurredAt: new Date().toISOString(),
        payload: {
          text: aiResponse.text,
          model: aiResponse.model,
          playbookId: decision.playbookId,
          appliedRuleIds: decision.appliedRuleIds,
        },
      },
      "processed",
    );

    await this.deps.eventStore?.updateStatus(event.id, "processed");
  }
}
