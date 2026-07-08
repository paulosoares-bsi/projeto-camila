export interface WebhookVerifier {
  verifySignature(rawBody: string, signature?: string): boolean;
}
