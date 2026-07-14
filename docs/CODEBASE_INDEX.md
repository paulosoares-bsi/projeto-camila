# CODEBASE_INDEX

> Mapa de responsabilidades do Projeto Camila.
>
> Objetivo: reduzir custo de contexto e acelerar onboarding.

---

## Estrutura de Pastas

```
apps/
  admin-dashboard/     # Dashboard administrativo (futuro)
  api/                 # API Express/TypeScript
  worker/              # Worker de processamento assíncrono

packages/
  core/                # Núcleo reutilizável
    src/
      events/          # EventProcessor, tipos de eventos
      prompt-builder/  # Construção de prompts
      rules/           # RulesEngine
      database/        # Repositórios (Event, Lead, Message, Hotmart)
      providers/       # AI, WhatsApp, Hotmart, n8n adapters
      tenants/         # TenantLoader, contexto por tenant

config/
  platform.config.yaml # Configuração global

tenants/
  <tenant>/           # Recursos específicos por cliente
    knowledge/
    playbooks/
    products/
    prompts/
    rules/
    tenant.yaml

docs/
  # Documentação oficial (ver lista completa)

scripts/
  smoke-message.mjs    # Smoke test de integração
  apply-migrations.mjs
  create-database.mjs

requests/
  *.http               # Testes via REST Client
```

---

## Responsabilidades por Componente

### API (`apps/api/`)
- Recepção de webhooks (WhatsApp, Hotmart, APIs externas)
- Interface externa (REST endpoints)
- Health check (`/health`)
- Não contém regra de negócio

### Worker (`apps/api/worker.ts` ou `apps/worker/`)
- Processamento assíncrono de eventos
- Consome eventos do EventStore
- Executa EventProcessor

### Core (`packages/core/src/`)

| Módulo | Responsabilidade |
|--------|------------------|
| `events/event-processor.ts` | Orquestra processamento: carrega tenant, avalia regras, constrói prompt, chama IA, envia resposta, persiste |
| `prompt-builder/prompt-builder.ts` | Monta prompt com persona, estado do lead, histórico, mensagem atual |
| `rules/rules-engine.ts` | Avalia regras de negócio para classificação de leads |
| `database/event-store.ts` | Persistência de eventos (append, updateStatus) |
| `database/lead-repository.ts` | CRUD de leads, upsert por externalContactId |
| `database/message-repository.ts` | CRUD de mensagens, listRecentByLead |
| `database/hotmart-repository.ts` | Persistência de eventos Hotmart |
| `providers/ai/factory.ts` | Factory de AI providers (Ollama, OpenRouter, OpenAI, Anthropic) |
| `providers/ai/openrouter-provider.ts` | Adapter OpenRouter (OpenAI SDK compatível) |
| `providers/whatsapp/types.ts` | Interface WhatsAppProvider |
| `providers/source-adapter.ts` | Interface genérica para normalização de eventos |
| `tenants/tenant-loader.ts` | Carrega contexto do tenant (knowledge, playbooks, prompts, regras) |

### Providers

| Provider | Função |
|----------|--------|
| `ai/` | Geração de resposta via IA |
| `whatsapp/` | Envio de mensagens (mock, evolution) |
| `payments/` | Integração Hotmart (estrutura) |
| `webhooks/` | Orquestração (n8n, etc.) |

### Database (`database/migrations/`)
- Schema: `events`, `leads`, `messages`, `hotmart_events`
- Migrations em SQL puro

### Tenants (`tenants/camila-quindere/`)
- `knowledge/knowledge_master.md` – base de conhecimento
- `playbooks/` – estratégias comerciais
- `products/` – catálogo de produtos
- `prompts/` – system prompts
- `rules/` – regras de classificação
- `tenant.yaml` – configuração do tenant

---

## Fluxo de Dados

```
Webhook (WhatsApp/Hotmart/API)
        ↓
    API (apps/api)
        ↓
  EventStore (append)
        ↓
    Worker (poll)
        ↓
  EventProcessor
        ↓
  PromptBuilder → AIProvider → WhatsAppProvider
        ↓
  Persistência (events, messages, leads)
```

---

## Como Contribuir

1. Leia `docs/PROJECT_STATE.md`
2. Leia `docs/DEVELOPMENT_WORKFLOW.md`
3. Use `pnpm typecheck` antes de commitar
4. Teste com `pnpm smoke:message`
5. Documente em `docs/` ao concluir
