import type { PlatformConfig } from "../../config/types.js";
import { N8nWebhookVerifier } from "./n8n-provider.js";
import type { WebhookVerifier } from "./types.js";

export function createWebhookVerifier(config: PlatformConfig): WebhookVerifier {
  return new N8nWebhookVerifier(config.providers.webhooks.signingSecret);
}
