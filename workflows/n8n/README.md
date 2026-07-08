# n8n

No MVP, o n8n deve atuar como integrador/orquestrador externo.

Fluxo recomendado para mensagem recebida:

1. Webhook do WhatsApp/Evolution chega no n8n.
2. n8n normaliza o payload.
3. n8n chama `POST http://api:3333/webhooks/camila-quindere/message`.
4. A API registra evento, aplica regras, monta prompt, chama IA e envia resposta pelo provider configurado.

Exemplo de payload para a API:

```json
{
  "externalContactId": "5585999999999",
  "messageId": "evolution-message-id",
  "text": "Oi, queria saber o valor da mentoria",
  "channel": "whatsapp"
}
```
