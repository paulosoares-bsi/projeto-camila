import type { PlatformEvent } from "../../events/types.js";

export interface PaymentProvider {
  normalizeWebhook(tenantId: string, payload: Record<string, unknown>): PlatformEvent | null;
}
