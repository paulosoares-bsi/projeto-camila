# PROJECT_STATE

> Documento oficial do estado atual do Projeto Camila.
>
> Última atualização: 2026-07-10
>
> Este documento representa o estado arquitetural atual da plataforma.
>
> O código-fonte continua sendo a fonte da verdade.

---

# Objetivo

O Projeto Camila é uma plataforma **multi-tenant** para atendimento inteligente de clientes oriundos de WhatsApp, Hotmart e futuras integrações, centralizando informações, contexto e inteligência de negócio.

A plataforma deve permanecer desacoplada das integrações externas, permitindo evolução contínua sem impacto na regra de negócio.

---

# Leitura Obrigatória

Antes de qualquer alteração no projeto, ler obrigatoriamente:

1. docs/PROJECT_STATE.md
2. docs/PROJECT_PHILOSOPHY.md
3. docs/ARCHITECTURE_PRINCIPLES.md
4. docs/ARCHITECTURE.md
5. docs/architecture.md
6. docs/DEVELOPMENT_WORKFLOW.md
7. docs/NEXT_SPRINT.md
8. docs/PROJECT_HISTORY.md

Consultar quando necessário:

- docs/BACKLOG.md
- docs/local-development.md
- docs/hotmart-webhooks.md
- docs/how-to-add-tenant.md
- docs/O que a Camila precisa.txt

Caso exista qualquer divergência entre documentação e implementação, o código-fonte prevalece.

---

# Estado Atual da Plataforma

Atualmente a plataforma possui:

- arquitetura multi-tenant;
- API;
- Worker;
- PostgreSQL;
- Event Store;
- Lead Repository;
- Message Repository;
- PromptBuilder;
- OllamaProvider;
- MockAIProvider;
- Evolution Provider;
- estrutura inicial do Hotmart Provider;
- Knowledge Base por tenant;
- Playbooks por tenant;
- arquitetura preparada para múltiplos modelos de IA.

A infraestrutura base encontra-se consolidada.

---

# Stack Oficial

- TypeScript
- Node.js
- Docker Compose
- PostgreSQL
- n8n
- Ollama
- Evolution API

---

# Infraestrutura Oficial

Durante o desenvolvimento utilizar:

- PostgreSQL em Docker;
- API em Docker;
- Worker em Docker;
- n8n em Docker;
- Ollama executando no host Windows.

O fluxo oficial de desenvolvimento encontra-se em:

```
docs/DEVELOPMENT_WORKFLOW.md
```

---

# IA da Plataforma

Runtime oficial:

```
Ollama
```

Modelo oficial:

```
qwen3:4b-instruct
```

A plataforma deve permanecer preparada para futura substituição do modelo sem alterações na lógica de negócio.

---

# IA de Desenvolvimento

O desenvolvimento utiliza duas responsabilidades distintas.

## ChatGPT

Responsável por:

- auditoria;
- pesquisa;
- arquitetura;
- planejamento;
- revisão técnica;
- documentação;
- definição do escopo de implementação.

Sempre que possível, pequenas alterações deverão ser realizadas manualmente pelo desenvolvedor orientado pelo ChatGPT.

---

## Agente de Desenvolvimento

Utilizado apenas quando houver ganho real de produtividade.

Exemplos:

- alterações envolvendo muitos arquivos;
- grandes refatorações;
- tarefas repetitivas;
- geração de grande volume de código.

O Agente não substitui as decisões arquiteturais do ChatGPT.

---

# Organização dos Tenants

Cada tenant possui isolamento completo de recursos.

Estrutura padrão:

```
tenants/<tenant>/

knowledge/
playbooks/
products/
prompts/
rules/
tenant.yaml
```

Não existem arquivos globais contendo regras de negócio específicas de tenants.

---

# Responsabilidades dos Componentes

## API

Receber eventos externos.

Não contém regra de negócio.

---

## Worker

Executar processamento assíncrono.

---

## Core

Responsável por:

- regras de negócio;
- PromptBuilder;
- contexto da conversa;
- decisão da IA;
- integração entre componentes.

Toda regra de negócio permanece nesta camada.

---

## PostgreSQL

Persistência oficial da plataforma.

---

## n8n

Responsável apenas por orquestração.

Não deve conter regras de negócio.

---

## Evolution API

Gateway de comunicação com WhatsApp.

---

## Ollama

Runtime oficial da IA utilizada pela plataforma.

---

# Estado Atual da Camada de IA

Atualmente a plataforma possui:

- PromptBuilder;
- System Prompt por tenant;
- Knowledge Base por tenant;
- Contexto de conversa;
- Histórico de mensagens;
- OllamaProvider funcional;
- arquitetura preparada para futura evolução.

Ainda não fazem parte da plataforma:

- Tool Calling;
- RAG;
- Embeddings;
- Busca semântica;
- Memória de longo prazo.

Estas funcionalidades serão implementadas apenas quando houver necessidade comprovada.

---

# Decisões Arquiteturais Permanentes

Estas decisões não devem ser alteradas sem nova revisão arquitetural.

## Multi-tenancy

Toda informação específica de negócio pertence ao tenant correspondente.

---

## Core

Toda regra de negócio permanece no Core.

---

## n8n

Permanece exclusivamente como orquestrador.

---

## PromptBuilder

Responsável apenas por montar o contexto enviado ao modelo.

Não deve conter regras de negócio.

---

## IA

A plataforma deve permanecer desacoplada do modelo utilizado.

Trocas futuras de modelo não devem alterar a lógica de negócio.

---

## Leads

Telefone nunca será a chave primária.

Leads possuem UUID próprio.

---

## Identidades

A evolução prevista contempla uma entidade própria para múltiplas identidades de um mesmo Lead.

Exemplos:

- WhatsApp
- Hotmart
- Telegram
- Instagram
- E-mail

---

# Backlog Arquitetural

Já aprovados para evolução futura:

- Tool Calling;
- RAG;
- Embeddings;
- Busca semântica;
- Memória de longo prazo;
- Bind Mount para desenvolvimento (redução de rebuilds);
- Validação automática da configuração do Ollama durante o startup.

Esses itens deverão ser implementados apenas quando fizerem parte do escopo de uma sprint.

---

# Princípios Permanentes

Toda evolução da plataforma deverá priorizar:

1. simplicidade;
2. baixo acoplamento;
3. alta coesão;
4. manutenibilidade;
5. extensibilidade;
6. compatibilidade entre tenants;
7. economia de recursos;
8. estabilidade da arquitetura;
9. decisões baseadas em documentação oficial e evidências técnicas;
10. evitar otimizações prematuras.

---

# Observações Finais

O Projeto Camila evolui por meio de sprints incrementais.

Cada sprint deve preservar a arquitetura existente, evitar refatorações paralelas e manter compatibilidade com os tenants atuais.

Toda alteração arquitetural deverá ser registrada em:

- PROJECT_HISTORY.md
- ARCHITECTURE_PRINCIPLES.md

O fluxo oficial de desenvolvimento, testes, documentação e Git encontra-se exclusivamente em:

```
docs/DEVELOPMENT_WORKFLOW.md
```