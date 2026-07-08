# Webhooks Hotmart e Eventos da Plataforma

## Endpoint

Endpoint preferencial para Hotmart:

```text
POST /webhooks/:tenantId/platform/hotmart
```

Alias curto:

```text
POST /webhooks/:tenantId/hotmart
```

Para Camila:

```text
POST /webhooks/camila-quindere/platform/hotmart
```

No n8n:

```text
http://api:3333/webhooks/camila-quindere/platform/hotmart
```

## Eventos Hotmart importantes para a Camila

| Hotmart | Evento interno | Prioridade | Uso na plataforma |
| --- | --- | --- | --- |
| Venda aprovada | `PURCHASE_APPROVED` | Alta | Registrar compra, mudar estado para cliente, iniciar onboarding e Customer Success. |
| Venda reembolsada | `PURCHASE_REFUNDED` | Alta | Registrar reembolso, encerrar/corrigir jornada e iniciar playbook de feedback. |
| Pedido de reembolso | `REFUND_REQUESTED` | Alta | Coletar motivo, oferecer conversa com Camila e registrar risco. |
| Carrinho abandonado | `CART_ABANDONED` | Alta | Iniciar recuperacao comercial sem pressao. |
| Venda criada | `PURCHASE_CREATED` | Media | Registrar tentativa de compra e enriquecer funil. |
| Venda atrasada | `PURCHASE_DELAYED` | Media | Acompanhar pagamento pendente/atrasado. |
| Venda expirada | `PURCHASE_EXPIRED` | Media | Encerrar tentativa de pagamento e disparar follow-up leve. |
| Venda cancelada | `PURCHASE_CANCELED` | Media | Registrar cancelamento e evitar automacoes de cliente ativa. |
| Venda completa | `PURCHASE_COMPLETE` | Baixa/Media | Confirmar conclusao financeira quando aplicavel. |
| Assinatura criada | `SUBSCRIPTION_CREATED` | Baixa no MVP | Util se a mentoria virar assinatura/recorrencia. |
| Assinatura cancelada | `SUBSCRIPTION_CANCELED` | Baixa no MVP | Util se houver recorrencia. |

## Eventos importantes que nao sao Hotmart por padrao

Esses devem ser gerados por integracoes da plataforma, n8n, area de membros ou rotinas agendadas:

| Evento interno | Origem provavel | Regra da Camila |
| --- | --- | --- |
| `FIRST_ACCESS` | Area de membros/plataforma de aulas | Cliente fez o primeiro acesso apos compra. |
| `NO_PLATFORM_ACCESS` | Rotina agendada/n8n | Cliente nao acessou em 24h, 2 dias ou 7 dias. |
| `STUDENT_RECOVERED` | Area de membros/plataforma de aulas | Cliente voltou a acessar apos risco de abandono. |
| `MENTORING_ENDING` | Rotina agendada/banco | Dez dias antes do fim da mentoria, alertar Camila. |

## Eventos que vamos tratar depois

- Webhook de acesso da plataforma de aulas.
- Job diario de verificacao de ausencia de acesso.
- Job de fim de mentoria.
- Playbooks especificos para onboarding, recuperacao e reembolso.
