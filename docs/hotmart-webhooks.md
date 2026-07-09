# Webhooks Hotmart e Eventos da Plataforma

Este documento define os webhooks oficiais da Hotmart, os eventos internos da plataforma e o mapeamento entre ambos.

O objetivo é desacoplar eventos externos da regra de negócio do Projeto Camila.

---

# Endpoint Oficial

Endpoint preferencial:

```text
POST /webhooks/:tenantId/platform/hotmart
```

Alias compatível:

```text
POST /webhooks/:tenantId/hotmart
```

Exemplo para o tenant Camila:

```text
POST /webhooks/camila-quindere/platform/hotmart
```

Durante o desenvolvimento via Docker:

```text
http://api:3333/webhooks/camila-quindere/platform/hotmart
```

---

# Fluxo

```text
Hotmart

↓

Webhook

↓

API

↓

Event Processor

↓

Evento Interno

↓

Rules Engine

↓

Playbooks

↓

Persistência

↓

IA / WhatsApp
```

A partir do momento em que o webhook é recebido, toda a plataforma deve trabalhar apenas com eventos internos.

---

# Eventos Hotmart Prioritários

| Hotmart | Evento Interno | Prioridade | Ação |
|----------|----------------|------------|------|
| Venda aprovada | `PURCHASE_APPROVED` | Alta | Registrar compra, converter Lead em Cliente, iniciar Onboarding e Customer Success. |
| Venda reembolsada | `PURCHASE_REFUNDED` | Alta | Registrar reembolso, interromper jornada e iniciar playbook de feedback. |
| Pedido de reembolso | `REFUND_REQUESTED` | Alta | Registrar solicitação, coletar motivo e oferecer atendimento humano quando aplicável. |
| Carrinho abandonado | `CART_ABANDONED` | Alta | Iniciar playbook de recuperação. |
| Venda criada | `PURCHASE_CREATED` | Média | Registrar intenção de compra e enriquecer o funil. |
| Venda atrasada | `PURCHASE_DELAYED` | Média | Acompanhar pagamento pendente. |
| Venda expirada | `PURCHASE_EXPIRED` | Média | Encerrar tentativa de pagamento e iniciar follow-up leve. |
| Venda cancelada | `PURCHASE_CANCELED` | Média | Registrar cancelamento e impedir automações de clientes ativos. |
| Venda concluída | `PURCHASE_COMPLETE` | Baixa | Confirmar encerramento do processo financeiro quando aplicável. |
| Assinatura criada | `SUBSCRIPTION_CREATED` | Baixa | Utilizada apenas caso existam produtos recorrentes. |
| Assinatura cancelada | `SUBSCRIPTION_CANCELED` | Baixa | Utilizada apenas caso existam produtos recorrentes. |

---

# Eventos Internos da Plataforma

Os eventos abaixo não são enviados pela Hotmart.

São produzidos pelo próprio Projeto Camila, por integrações ou por rotinas agendadas.

| Evento | Origem | Objetivo |
|--------|--------|----------|
| `FIRST_ACCESS` | Plataforma de aulas | Detectar primeiro acesso do aluno. |
| `NO_PLATFORM_ACCESS` | Rotina agendada | Identificar alunos que ainda não acessaram o conteúdo. |
| `STUDENT_RECOVERED` | Plataforma de aulas | Registrar retorno do aluno após período de ausência. |
| `MENTORING_ENDING` | Rotina agendada | Avisar proximidade do encerramento da mentoria. |

---

# Eventos Futuros

Ainda não fazem parte do MVP:

- Webhook da plataforma de aulas.
- Monitoramento automático de acesso dos alunos.
- Monitoramento automático do encerramento da mentoria.
- Eventos provenientes de Instagram.
- Eventos provenientes de Telegram.
- Eventos provenientes de Email.

---

# Regras

- A API apenas valida e transforma o webhook recebido.
- Toda regra de negócio pertence ao Core.
- O Event Processor converte eventos externos em eventos internos.
- Playbooks trabalham apenas com eventos internos.
- A IA nunca deve depender diretamente do formato do webhook da Hotmart.

---

# Observações

Novos eventos da Hotmart poderão ser adicionados futuramente sem necessidade de alterar a arquitetura da plataforma.

Basta criar o mapeamento entre o evento externo e o evento interno correspondente.