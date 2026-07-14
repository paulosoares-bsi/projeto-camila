import type { NormalizedEvent, SourceAdapter } from "./source-adapter.js";
import crypto from "node:crypto";

export class HotmartWebhookHandler implements SourceAdapter {
  constructor(private readonly secret: string) {}

  async receive(payload: Record<string, unknown>): Promise<NormalizedEvent> {
    const eventName = payload.event as string;
    const data = payload.data as Record<string, unknown>;

    if (!eventName || !data) {
      throw new Error("Payload Hotmart inválido");
    }

    // Normalização simplificada de eventos Hotmart
    let type = eventName;
    if (eventName === "PURCHASE_COMPLETE" || eventName === "PURCHASE_APPROVED") {
      type = "PURCHASE_APPROVED";
    } else if (eventName === "PURCHASE_REFUNDED") {
      type = "PURCHASE_REFUNDED";
    } else if (eventName === "SUBSCRIPTION_CANCELED") {
      type = "SUBSCRIPTION_CANCELED";
    }

    return {
      tenantId: (data.producer_email as string) ?? "camila-quindere",
      type,
      source: "hotmart",
      payload: {
        raw: payload,
      },
      occurredAt: new Date().toISOString(),
    };
  }

  /**
   * Valida o token / assinatura enviado pela Hotmart.
   */
  validateSignature(token: string, htoken: string): boolean {
    if (!token || !htoken) return false;
    return token === htoken;
  }
}
