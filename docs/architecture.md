# Arquitetura

A plataforma e multi-tenant e orientada a eventos.

O core e reutilizavel entre clientes:

- eventos;
- rules engine;
- state machine;
- playbook runner;
- prompt builder;
- providers;
- auditoria.

As partes substituiveis ficam atras de contratos:

- IA: `AIProvider`;
- WhatsApp: `WhatsAppProvider`;
- Webhooks: `WebhookVerifier`;
- Pagamentos: `PaymentProvider`.

Para trocar OpenAI por Claude, altere apenas `config/platform.config.yaml`:

```yaml
providers:
  ai:
    provider: anthropic
    model: claude-3-5-sonnet-latest
    apiKey: ${ANTHROPIC_API_KEY}
```

Para usar mocks em desenvolvimento local barato:

```yaml
providers:
  ai:
    provider: mock
    model: mock
  whatsapp:
    provider: mock
```
