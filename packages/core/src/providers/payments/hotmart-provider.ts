import crypto from "node:crypto";
import type { PlatformEvent } from "../../events/types.js";
import type { PaymentProvider } from "./types.js";

const hotmartEventMap = new Map<string, PlatformEvent["type"]>([
  ["PURCHASE_APPROVED", "PURCHASE_APPROVED"],
  ["PURCHASE_CANCELED", "PURCHASE_CANCELED"],
  ["PURCHASE_CANCELLED", "PURCHASE_CANCELED"],
  ["PURCHASE_COMPLETE", "PURCHASE_COMPLETE"],
  ["PURCHASE_COMPLETED", "PURCHASE_COMPLETE"],
  ["PURCHASE_CREATED", "PURCHASE_CREATED"],
  ["PURCHASE_DELAYED", "PURCHASE_DELAYED"],
  ["PURCHASE_OVERDUE", "PURCHASE_DELAYED"],
  ["PURCHASE_EXPIRED", "PURCHASE_EXPIRED"],
  ["PURCHASE_REFUNDED", "PURCHASE_REFUNDED"],
  ["PURCHASE_REFUND", "PURCHASE_REFUNDED"],
  ["REFUND_REQUESTED", "REFUND_REQUESTED"],
  ["PURCHASE_REFUND_REQUESTED", "REFUND_REQUESTED"],
  ["SUBSCRIPTION_CANCELED", "SUBSCRIPTION_CANCELED"],
  ["SUBSCRIPTION_CANCELLED", "SUBSCRIPTION_CANCELED"],
  ["SUBSCRIPTION_CREATED", "SUBSCRIPTION_CREATED"],
  ["CART_ABANDONED", "CART_ABANDONED"],
  ["ABANDONED_CART", "CART_ABANDONED"],
]);

function readHotmartEventName(payload: Record<string, unknown>): string {
  const direct = payload.event ?? payload.type ?? payload.eventType;
  if (direct) {
    return String(direct);
  }

  const nestedData = payload.data;
  if (nestedData && typeof nestedData === "object") {
    const data = nestedData as Record<string, unknown>;
    return String(data.event ?? data.type ?? "");
  }

  return "";
}

export class HotmartPaymentProvider implements PaymentProvider {
  normalizeWebhook(tenantId: string, payload: Record<string, unknown>): PlatformEvent | null {
    const eventName = readHotmartEventName(payload).trim().toUpperCase();
    const eventType = hotmartEventMap.get(eventName) ?? "EXTERNAL_PLATFORM_EVENT";

    return {
      id: crypto.randomUUID(),
      type: eventType,
      tenantId,
      source: "hotmart",
      occurredAt: new Date().toISOString(),
      payload: {
        providerEvent: eventName,
        raw: payload,
      },
    };
  }
}
