/**
 * SourceAdapter – Interface genérica para normalização de eventos de múltiplas fontes.
 *
 * Cada fonte de dados (WhatsApp, Hotmart, APIs externas, Telegram, Email)
 * deve implementar esta interface para converter seu payload nativo
 * em um NormalizedEvent que o EventProcessor entende.
 */

export interface NormalizedEvent {
  tenantId: string;
  type: string;
  source: string;
  payload: Record<string, unknown>;
  occurredAt: string;
}

export interface SourceAdapter<Payload = unknown> {
  /**
   * Recebe o payload bruto da fonte e retorna um evento normalizado.
   * Deve validar assinatura/estrutura quando aplicável.
   */
  receive(payload: Payload): Promise<NormalizedEvent>;
}

/**
 * Tipos de eventos suportados pela plataforma.
 * Novos tipos devem ser adicionados aqui e no EventProcessor.
 */
export enum EventType {
  MESSAGE_RECEIVED = "MESSAGE_RECEIVED",
  HOTMART_PURCHASE = "HOTMART_PURCHASE",
  HOTMART_SUBSCRIPTION = "HOTMART_SUBSCRIPTION",
  EXTERNAL_API_DATA = "EXTERNAL_API_DATA",
  TELEGRAM_MESSAGE = "TELEGRAM_MESSAGE",
  EMAIL_RECEIVED = "EMAIL_RECEIVED",
}

/**
 * Fontes de eventos conhecidas.
 */
export enum EventSource {
  WHATSAPP = "whatsapp",
  HOTMART = "hotmart",
  EXTERNAL_API = "external_api",
  TELEGRAM = "telegram",
  EMAIL = "email",
}
