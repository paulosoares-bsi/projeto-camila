# Plataforma de Automacao Comercial Inteligente

Base multi-tenant para automacao comercial orientada a eventos.

## Estrutura

```text
config/                 Configuracao global da plataforma
tenants/                Configuracoes por cliente
packages/core/          Nucleo reutilizavel
apps/api/               API para webhooks e integracoes
database/migrations/    Schema inicial do Postgres
workflows/n8n/          Documentacao dos fluxos n8n
docs/                   Arquitetura e operacao
```

## Endpoints principais

```text
GET  /health
POST /webhooks/camila-quindere/message
POST /webhooks/camila-quindere/platform/hotmart
```

## Rodando com Docker Compose

Suba toda a infraestrutura pelo Docker Desktop:

```text
docker compose up -d
```

Isso inicia Postgres, n8n, API e Worker. A API aplica as migrations ao iniciar.

Use `.env.example` apenas como referencia para chaves opcionais de providers.

Execucao manual da API ou Worker fora do Docker Compose esta obsoleta.

Healthcheck:

```text
GET http://localhost:3333/health
```

Mensagem de teste:

```text
POST http://localhost:3333/webhooks/camila-quindere/message
```
