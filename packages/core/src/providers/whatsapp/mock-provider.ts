import type { WhatsAppProvider, SendMessageInput } from "./types.js";

export class MockWhatsAppProvider implements WhatsAppProvider {
  async sendMessage(input: SendMessageInput): Promise<void> {
    console.log("[mock-whatsapp]", {
      tenantId: input.tenantId,
      instance: input.instance,
      to: input.to,
      text: input.text,
    });
  }
}
