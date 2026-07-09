# Desenvolvimento Local

Este documento descreve o ambiente oficial de desenvolvimento do Projeto Camila.

O ambiente deve ser executado exclusivamente utilizando Docker Compose no Docker Desktop.

Não é necessário WSL.

---

# Serviços

O ambiente é composto pelos seguintes serviços:

- PostgreSQL
- API
- Worker
- n8n (quando utilizado pela sprint)

---

# Subir Ambiente

## Ambiente completo

```bash
docker compose up -d
```

Serviços iniciados:

- postgres
- api
- worker
- n8n

---

## Ambiente mínimo

Durante sprints que não utilizarem o n8n:

```bash
docker compose up -d postgres api worker
```

---

# Reconstruir Ambiente

```bash
docker compose up --build -d
```

---

# Parar Ambiente

```bash
docker compose down
```

---

# Destruir Ambiente

```bash
docker compose down -v --remove-orphans
```

---

# Comunicação entre Containers

A comunicação interna deve utilizar exclusivamente os nomes dos serviços Docker.

Exemplos:

```text
postgres
api
worker
n8n
```

Nunca utilizar `localhost` entre containers.

---

# Endpoint do Projeto

No n8n, os eventos devem ser enviados para:

```text
http://api:3333/webhooks/camila-quindere/message
```

Para webhooks da Hotmart:

```text
http://api:3333/webhooks/camila-quindere/platform/hotmart
```

---

# Desenvolvimento

A execução manual da API e do Worker utilizando:

```bash
pnpm api

pnpm worker
```

deve ser utilizada apenas para depuração.

O fluxo oficial é sempre via Docker Compose.

---

# Provider de IA

Durante o desenvolvimento da plataforma, utilizar:

```yaml
providers:
  ai:
    provider: ollama
    model: qwen3:4b-instruct
```

O Provider Mock permanece disponível para testes específicos.

Exemplo:

```yaml
providers:
  ai:
    provider: mock
    model: mock
```

---

# WhatsApp

Quando necessário utilizar mock:

```yaml
providers:
  whatsapp:
    provider: mock
```

Caso contrário, utilizar o provider oficial configurado para o tenant.

---

# Banco de Dados

Após alterações em migrations:

```bash
node scripts/apply-migrations.mjs
```

Caso necessário recriar o banco:

```bash
node scripts/create-database.mjs
```

---

# Logs

Logs completos:

```bash
docker compose logs -f
```

Logs da API:

```bash
docker compose logs -f api
```

Logs do Worker:

```bash
docker compose logs -f worker
```

Logs do n8n:

```bash
docker compose logs -f n8n
```

---

# Princípios

- O Docker Compose é o ambiente oficial de desenvolvimento.
- O Core deve funcionar independentemente do provider de IA utilizado.
- O modelo oficial da plataforma é `qwen3:4b-instruct`.
- O n8n deve permanecer desligado quando não fizer parte da sprint.
- Toda comunicação entre containers deve utilizar os nomes dos serviços da rede Docker.