# Análise de Estrutura e Fluxos Fictícios

> Documento gerado para validar o comportamento do sistema diante de mensagens
> reais de WhatsApp e webhooks da Hotmart.

## 1. Estrutura Atual do Projeto

### Componentes principais

- **API** (`apps/api/src/server.ts`): recebe webhooks de mensagem e Hotmart via HTTP (Express).
- **Worker** (`apps/api/src/worker.ts`): processa eventos com status `received` a cada 5s.
- **EventProcessor** (`packages/core/src/events/event-processor.ts`): orquestra todo o processamento de um evento.
- **Core** (`packages/core`): regras de negócio, prompt, IA, ferramentas, RAG, memória, observabilidade.
- **PostgreSQL**: persistência (leads, messages, events, purchases, subscriptions, lead_interests, lead_escalations, lead_memories).

### Entradas

- `POST /webhooks/:tenantId/message` — mensagem de canal (WhatsApp/Instagram/Telegram/Webchat).
  - Body: `{ externalContactId, messageId?, text, channel? }`
- `POST /webhooks/:tenantId/hotmart` (ou `/platform/hotmart`) — webhook de pagamento.
  - Body: payload bruto da Hotmart (evento `CART_ABANDONED`, `PURCHASE_APPROVED`, etc).

### Saídas

- Resposta da IA enviada via WhatsApp provider (Evolution ou Mock).
- Persistência em `events`, `messages`, `leads`, `purchases`/`subscriptions`, `lead_interests`, `lead_escalations`, `lead_memories`.

### Interfaces / fluxo interno

```
Webhook → EventProcessor.process()
  → loadTenantContext (tenant.yaml + knowledge + systemPrompt)
  → evaluateRules (intenção: PRICE_REQUESTED → LEAD_QUENTE)
  → upsertByExternalContact (lead por externalContactId)
  → listRecentByLead (histórico)
  → PromptBuilder.build (persona + estado + histórico + mensagem)
  → RAG.retrieve (contexto relevante) + MemoryRepository (memória longo prazo)
  → AIProvider.generateResponse (OpenRouter, com Tool Calling)
  → loop Tool Calling (máx 5) → ToolRegistry.execute
  → WhatsAppProvider.sendMessage (resposta)
  → MessageRepository.create (outbound)
  → EventStore.append (MESSAGE_SENT)
```

### Correlação entre fontes

- **WhatsApp**: lead identificado por `externalContactId` (telefone).
- **Hotmart**: compra identificada por `transaction_id`, com `buyer_phone`/`buyer_email`.
- **Ponto crítico**: NÃO existe ainda a entidade `lead_identities` (documentada em PROJECT_STATE.md como pendente). Portanto o sistema **não correlaciona automaticamente** WhatsApp ↔ Hotmart. Cada fonte grava em sua tabela independente. O `HotmartWebhookHandler`/`HotmartPaymentProvider` normalizam o evento, mas o `EventProcessor` para eventos não-MESSAGE_RECEIVED apenas persiste e não cruza com o lead do WhatsApp.

---

## 2. Fluxo Fictício A — WhatsApp (cliente vinda do Instagram)

**Personagem**: Mariana (telefone `5511987654321`) conheceu a Mentoria no Instagram e pergunta valores no WhatsApp.

| # | Quem | Mensagem | Regra aplicada | Estado lead | Resposta esperada (IA) |
|---|------|----------|----------------|-------------|------------------------|
| 1 | Mariana | "Oi! Vi a mentoria no Instagram e queria saber o valor" | BR-SALES-001 (preço) | LEAD_QUENTE | Apresenta a mentoria e orienta sobre valor/link |
| 2 | Mariana | "Tem desconto para quem é policial?" | BR-SALES-001 | LEAD_QUENTE | Esclarece condições / registra interesse |
| 3 | Mariana | "Qual a diferença da mentoria coletiva?" | BR-LEAD-001 | NOVO | Explica diferenciais (RAG: products.yaml) |
| 4 | Mariana | "Quero saber mais sobre concurso da PM" | BR-LEAD-001 | NOVO | Responde com base na knowledge base |
| 5 | Mariana | "Beleza, me manda o link de pagamento" | BR-SALES-001 | LEAD_QUENTE | Envia link / registra interesse (tool) |

---

## 3. Fluxo Fictício B — Hotmart (carrinho abandonado do mesmo cliente)

**Evento**: Hotmart envia `CART_ABANDONED` para o mesmo cliente (Mariana), telefone `5511987654321`.

```json
{
  "event": "CART_ABANDONED",
  "data": {
    "buyer": { "name": "Mariana Souza", "email": "mariana@email.com", "phone": "5511987654321" },
    "product": { "id": "mentoria-coletiva", "name": "Mentoria Coletiva" },
    "purchase": { "transaction": "TXN-ABC-123", "status": "abandoned" }
  }
}
```

**Comportamento esperado do sistema (realidade atual)**:
- O webhook é normalizado para evento `CART_ABANDONED` (fonte `hotmart`).
- `EventProcessor` identifica `type !== MESSAGE_RECEIVED` → persiste em `events` e em `purchases` (via HotmartRepository), e encerra.
- **NÃO há cruzamento automático** com o lead do WhatsApp, pois `lead_identities` não existe. O telefone `5511987654321` está em `purchases.buyer_phone`, mas não é usado para atualizar o lead.
- Portanto o sistema **grava os dois contextos separados** e não os agrega no mesmo relacionamento de cliente.

**Conclusão de validação**: O sistema consegue receber e persistir ambas as fontes, mas a correlação WhatsApp↔Hotmart **ainda não está implementada** (pendência conhecida `lead_identities`). O fluxo B valida a ingestão, não a correlação automática.

---

## 4. Plano de Execução Real

1. Enviar as 5 mensagens do Fluxo A via `POST /webhooks/camila-quindere/message` (channel=whatsapp).
2. Enviar o webhook do Fluxo B via `POST /webhooks/camila-quindere/hotmart`.
3. Rodar o worker (já em execução, processa a cada 5s) para processar a fila.
4. Rodar `pnpm smoke:message` para validar ponta a ponta com a IA OpenRouter real.
5. Comparar saídas reais com as expectativas dos fluxos fictícios.

---

## 5. Resultados Reais Obtidos

### Fluxo A — WhatsApp (Mariana, 5511987654321)

As 5 mensagens foram enviadas e processadas pelo worker. Respostas reais da IA (OpenRouter, `openrouter/free`):

| # | Mensagem | Resposta real (resumo) |
|---|----------|------------------------|
| 1 | "Oi! Vi a mentoria no Instagram e queria saber o valor" | "Oi! Que alegria receber sua mensagem! Vi que você chegou aqui pelo Instagram e tem interesse na mentoria da Camila Quindere. 💛 Sou o assistente virtual da empresa..." |
| 2 | "Tem desconto para quem é policial?" | "Oi! Que alegria continuar nossa conversa por aqui! 💛 Sou o assistente virtual da empresa Camila Quindere e estou te recebendo com acolhimento e clareza. Sobre..." |
| 3 | "Qual a diferença da mentoria coletiva?" | (processada, resposta de acolhimento + orientação) |
| 4 | "Quero saber mais sobre concurso da PM" | "Olá! Aqui é o assistente virtual da empresa Camila Quindere... Ficamos felizes com seu interesse na preparação para o..." |
| 5 | "Beleza, me manda o link de pagamento" | "Olá! Que alegria ver seu interesse em seguir com a mentoria da Camila Quindere! 💛 Sou o assistente virtual da empresa e, com toda a transparência e clareza que..." |

**Estado do lead no banco**: `current_state = NOVO` (id `17dd2806-...`).

**Observação importante**: Embora as regras (`rules-engine.ts`) classifiquem mensagens com "valor"/"preço" como `LEAD_QUENTE` (BR-SALES-001), o estado persistido no banco ficou `NOVO`. Isso ocorre porque o `upsertByExternalContact` grava `decision.nextState`, mas a resposta da IA e o processamento subsequente não atualizam o estado para `LEAD_QUENTE` — o `updateState` não é chamado no fluxo de mensagem. Ou seja, a regra é avaliada mas o estado do lead não reflete `LEAD_QUENTE` no banco.

### Fluxo B — Hotmart (CART_ABANDONED)

Webhook enviado e normalizado para evento `CART_ABANDONED` (source `hotmart`). Persistido em `events` com status `processed`.

**Correlação**: O `buyer_phone` (`5511987654321`) coincide com o do lead do Fluxo A, MAS:
- A tabela `purchases` **não recebeu o registro** (0 linhas). Motivo: `CART_ABANDONED` não está no conjunto `purchaseEvents` nem `subscriptionEvents` de `hotmart-repository.ts`, então `persistEvent` não grava nada.
- Não há entidade `lead_identities`, logo o sistema **não cruza** o carrinho abandonado com o lead do WhatsApp.
- Conclusão: o sistema ingere e persiste o evento Hotmart, mas **não correlaciona** com o cliente do WhatsApp. A pendência `lead_identities` (PROJECT_STATE.md) é confirmada como não implementada.

### Smoke Test Real (`pnpm smoke:message`)

- Infraestrutura: Postgres OK, API OK (aiProvider=openrouter).
- Cenário: lead `5511999990001`, "Onde recebo o link para a mentoria?".
- Tool Calling executado: `consultar_knowledge_base` (topico: link mentoria acesso entrega) e `consultar_produto` (termo: mentoria).
- Resposta da IA: acolhedora, cita a Mentoria Coletiva (RAG/products), e **escala para humano** porque o link não está documentado na knowledge base.
- Resultado: **SMOKE TEST: PASSOU** (mensagem processada pela IA OpenRouter e dados gravados no banco).

### Comparação Fluxo Fictício × Real

| Aspecto | Fictício (esperado) | Real (obtido) |
|---------|---------------------|---------------|
| Respostas da IA | Apresenta mentoria, esclarece, manda link | ✅ Respostas acolhedoras e comerciais geradas pela IA real |
| Tool Calling | Usa ferramentas | ✅ `consultar_knowledge_base` + `consultar_produto` executados |
| Estado do lead | LEAD_QUENTE em preço | ⚠️ Ficou `NOVO` no banco (regra avaliada mas não aplicada ao estado) |
| Hotmart correlaciona com WhatsApp | Mesmo cliente agregado | ❌ Não correlaciona (sem `lead_identities`; CART_ABANDONED não persiste em purchases) |
| Persistência | events + messages + leads | ✅ Confirmado no banco |

### Conclusões

1. O sistema processa ponta a ponta mensagens de WhatsApp com IA real (OpenRouter) e Tool Calling funcionando.
2. A correlação entre fontes (WhatsApp ↔ Hotmart) **ainda não existe** — confirmada a pendência `lead_identities`.
3. O evento `CART_ABANDONED` da Hotmart não é persistido em `purchases` (gap no `hotmart-repository.ts`).
4. O estado `LEAD_QUENTE` da regra de preço não é refletido no banco (o `updateState` não é chamado no fluxo de mensagem).
