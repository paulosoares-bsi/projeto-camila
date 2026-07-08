import crypto from "node:crypto";
import type { WebhookVerifier } from "./types.js";

export class N8nWebhookVerifier implements WebhookVerifier {
  constructor(private readonly signingSecret?: string) {}

  verifySignature(rawBody: string, signature?: string): boolean {
    if (!this.signingSecret) {
      return true;
    }

    if (!signature) {
      return false;
    }

    const digest = crypto.createHmac("sha256", this.signingSecret).update(rawBody).digest("hex");
    if (digest.length !== signature.length) {
      return false;
    }

    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  }
}
