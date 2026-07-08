export interface SendMessageInput {
  tenantId: string;
  instance: string;
  to: string;
  text: string;
}

export interface WhatsAppProvider {
  sendMessage(input: SendMessageInput): Promise<void>;
}
