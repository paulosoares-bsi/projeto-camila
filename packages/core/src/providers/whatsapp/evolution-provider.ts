import type { WhatsAppProvider, SendMessageInput } from "./types.js";

export class EvolutionWhatsAppProvider implements WhatsAppProvider {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey?: string,
  ) {}

  async sendMessage(input: SendMessageInput): Promise<void> {
    const response = await fetch(`${this.baseUrl}/message/sendText/${input.instance}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: this.apiKey ?? "",
      },
      body: JSON.stringify({
        number: input.to,
        text: input.text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Evolution API returned ${response.status} while sending WhatsApp message.`);
    }
  }
}
