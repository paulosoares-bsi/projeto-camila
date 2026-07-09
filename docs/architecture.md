# Arquitetura

A plataforma é multi-tenant, orientada a eventos e construída para desacoplar a lógica de negócio dos provedores externos.

O core deve permanecer reutilizável entre diferentes clientes (tenants), alterando apenas configurações, prompts, playbooks e bases de conhecimento.

## Componentes do Core

- Event Processor
- Rules Engine
- State Machine
- Playbook Runner
- Prompt Builder
- Providers
- Auditoria
- Persistência

## Contratos

Toda integração externa deve ocorrer através de contratos bem definidos.

- IA: `AIProvider`
- WhatsApp: `WhatsAppProvider`
- Webhooks: `WebhookVerifier`
- Pagamentos: `PaymentProvider`

A lógica de negócio nunca deve depender diretamente de OpenAI, Ollama, Evolution API, Hotmart ou qualquer outro fornecedor.

## Fluxo

```text
Webhook

↓

Event Processor

↓

Rules Engine

↓

Prompt Builder

↓

AIProvider

↓

Modelo de IA

↓

AIProvider

↓

Event Processor

↓

WhatsApp Provider
```

## Provedores de IA

O sistema deve permitir trocar o modelo de IA apenas por configuração.

O restante da aplicação não deve sofrer alterações.

Exemplo:

```yaml
providers:
  ai:
    provider: ollama
    model: qwen3:4b-instruct
```

ou

```yaml
providers:
  ai:
    provider: openai
    model: gpt-5.5
```

ou

```yaml
providers:
  ai:
    provider: anthropic
    model: claude-sonnet-4
```

## Desenvolvimento

Durante o desenvolvimento da plataforma será utilizado prioritariamente:

- Ollama
- qwen3:4b-instruct

A utilização de modelos locais é exclusiva para desenvolvimento e testes da plataforma.

O agente de desenvolvimento (Codex) continuará utilizando modelos da OpenAI.

Não faz parte da arquitetura utilizar modelos locais para desenvolvimento do código.

## Princípios

- Baixo acoplamento.
- Alta coesão.
- Componentes reutilizáveis.
- Configuração acima de implementação.
- Multi-tenant desde a arquitetura.
- Fácil substituição de provedores.
- Regras de negócio independentes do modelo de IA.