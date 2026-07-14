import type { NormalizedEvent } from "./source-adapter.js";

/**
 * Channel abstraction for multi-channel support.
 * Each channel (WhatsApp, Telegram, Email) implements this interface
 * to normalize inbound messages into NormalizedEvent.
 */
export interface ChannelAdapter {
  readonly channel: string;
  normalize(payload: unknown): Promise<NormalizedEvent>;
}

export abstract class BaseChannelAdapter implements ChannelAdapter {
  constructor(public readonly channel: string) {}
  abstract normalize(payload: unknown): Promise<NormalizedEvent>;
}