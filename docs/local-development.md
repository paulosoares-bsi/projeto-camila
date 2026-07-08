# Desenvolvimento local com Docker Compose

O ambiente local roda exclusivamente pelo Docker Desktop no Windows.

## Subir ambiente

```text
docker compose up -d
```

Servicos iniciados:

```text
postgres
n8n
api
worker
```

## Parar ambiente

```text
docker compose down
```

## Destruir ambiente

```text
docker compose down -v --remove-orphans
```

## Comunicacao interna

Use apenas nomes de servico da rede Docker:

```text
postgres
n8n
api
worker
```

No n8n, encaminhe eventos para:

```text
http://api:3333/webhooks/camila-quindere/message
```

Execucao manual com `pnpm dev:api` ou `pnpm dev:worker` esta obsoleta.

## Configuracao de providers

Durante desenvolvimento barato, voce pode usar:

```yaml
providers:
  ai:
    provider: mock
    model: mock
  whatsapp:
    provider: mock
```

Quando quiser usar OpenAI ou Claude, altere apenas `config/platform.config.yaml` e as variaveis no `.env`.
