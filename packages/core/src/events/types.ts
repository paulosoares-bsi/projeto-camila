export type EventType =
  | "MESSAGE_RECEIVED"
  | "MESSAGE_SENT"
  | "LEAD_CREATED"
  | "STATE_CHANGED"
  | "PLAYBOOK_STARTED"
  | "PLAYBOOK_FINISHED"
  | "HUMAN_HANDOFF"
  | "PURCHASE_APPROVED"
  | "PURCHASE_CANCELED"
  | "PURCHASE_COMPLETE"
  | "PURCHASE_CREATED"
  | "PURCHASE_DELAYED"
  | "PURCHASE_EXPIRED"
  | "PURCHASE_REFUNDED"
  | "REFUND_REQUESTED"
  | "SUBSCRIPTION_CANCELED"
  | "SUBSCRIPTION_CREATED"
  | "CART_ABANDONED"
  | "FIRST_ACCESS"
  | "NO_PLATFORM_ACCESS"
  | "STUDENT_RECOVERED"
  | "MENTORING_ENDING"
  | "EXTERNAL_PLATFORM_EVENT";

export interface PlatformEvent<TPayload extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  type: EventType;
  tenantId: string;
  leadId?: string;
  source: string;
  occurredAt: string;
  payload: TPayload;
}

export interface IncomingMessagePayload {
  externalContactId: string;
  messageId: string;
  text: string;
  channel: "whatsapp" | "instagram" | "telegram" | "webchat";
  raw?: unknown;
}
