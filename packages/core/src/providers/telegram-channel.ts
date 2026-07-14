import { BaseChannelAdapter } from "./channel.js";
import type { NormalizedEvent } from "./source-adapter.js";
import { EventSource, EventType } from "./source-adapter.js";

/**
 * Adapter para Telegram (exemplo de multi-channel).
 * Normaliza update do Telegram para NormalizedEvent.
 */
export class TelegramChannelAdapter extends BaseChannelAdapter {
  constructor(private readonly botToken: string = process.env.TELEGRAM_BOT_TOKEN ?? "") {
    super("telegram");
  }

  async normalize(payload: unknown): Promise<NormalizedEvent> {
    const update = payload as {
      message?: {
        message_id: number;
        from?: { id: number; username?: string };
        chat?: { id: number };
        text?: string;
      };
    };

    const msg = update.message;
    if (!msg || !msg.from || !msg.text) {
      throw new Error("Payload Telegram inválido: mensagem ou texto ausente");
    }

    return {
      tenantId: "camila-quindere",
      type: EventType.TELEGRAM_MESSAGE,
      source: EventSource.TELEGRAM,
      payload: {
        externalContactId: String(msg.from.id),
        messageId: String(msg.message_id),
        text: msg.text,
        channel: "telegram",
        username: msg.from.username,
      },
      occurredAt: new Date().toISOString(),
    };
  }
}