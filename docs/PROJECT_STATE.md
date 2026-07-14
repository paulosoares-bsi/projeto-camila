# PROJECT_STATE

> Documento oficial do estado atual do Projeto Camila.
>
> Última atualização: 2026-07-09
>
> Este documento deve ser considerado a referência oficial do projeto.

---

# ⚠️ Instruções para a IA

Antes de realizar qualquer alteração:

1. Leia integralmente este documento.
2. Leia o NEXT_SPRINT.md.
3. Analise o código-fonte do repositório.
4. Considere sempre o código como fonte da verdade.
5. Caso exista divergência entre documentação e código, informe a divergência antes de prosseguir.
6. Consulte o PROJECT_HISTORY.md apenas quando precisar compreender a evolução arquitetural do projeto.
7. Não proponha mudanças arquiteturais fora do escopo da sprint.
8. Ao concluir a sprint, atualize este documento e registre a evolução no PROJECT_HISTORY.md.

---

# Metodologia de Desenvolvimento

O Projeto Camila utiliza duas inteligências distintas com responsabilidades claramente separadas.

## ChatGPT

Responsável por:

- auditoria do código;
- investigação técnica;
- pesquisa de documentação oficial;
- pesquisa de benchmarks e experiências da comunidade;
- arquitetura;
- revisão das implementações;
- identificação de causa raiz;
- validação das alterações;
- planejamento das sprints;
- elaboração dos prompts para o Agente de Desenvolvimento.

Toda decisão arquitetural deve ser tomada pelo ChatGPT antes da implementação.

---

## Agente de Desenvolvimento

Responsável por:

- implementar alterações previamente delimitadas;
- refatorações locais;
- correções de bugs;
- execução de testes;
- operações de Git (branch, commit, merge quando solicitado).

O Agente NÃO deve:

- realizar auditorias amplas;
- alterar arquitetura por iniciativa própria;
- tomar decisões de negócio;
- realizar grandes refatorações fora do escopo da sprint.

Sempre receberá:

- escopo fechado;
- objetivos claros;
- restrições explícitas.

---

# Economia de Recursos

Toda implementação deve priorizar:

- mínimo consumo de tokens;
- mínimo consumo de CPU;
- mínimo consumo de RAM;
- mínimo número de chamadas ao modelo;
- reutilização de contexto;
- prompts objetivos;
- evitar processamento desnecessário.

Sempre que uma alteração puder ser realizada manualmente com segurança, ela deve ser preferida em vez de consumir recursos do Agente de Desenvolvimento.

---

# Objetivo

O Projeto Camila é uma plataforma multi-tenant de atendimento inteligente via WhatsApp para comercialização e suporte da Mentoria Camila Quinderé.

A plataforma deverá ser capaz de:

- atender leads automaticamente;
- conduzir vendas;
- executar playbooks comerciais;
- realizar Customer Success;
- consultar Knowledge Base;
- utilizar IA local para atendimento;
- evoluir futuramente para um agente baseado em Tool Calling.

---

# Arquitetura Atual

## Stack

- Docker Compose
- PostgreSQL
- n8n
- API
- Worker
- Ollama
- Evolution API

---

# IA da Plataforma

Runtime oficial:

OpenRouter

Modelo oficial:

**openrouter/free**

A arquitetura deve permanecer preparada para futura migração para outros modelos locais ou em nuvem sem alterar a lógica de negócio.

---

# IA de Desenvolvimento

A IA utilizada durante o desenvolvimento é independente da IA utilizada pela plataforma.

Responsabilidades:

- arquitetura → ChatGPT;
- implementação → Agente de Desenvolvimento.

O modelo utilizado pelo Agente poderá mudar ao longo do projeto sem impactar a arquitetura da plataforma.

---

# Organização dos Tenants

Cada tenant possui recursos próprios.

Estrutura:

tenants/<tenant>/

- knowledge/
- playbooks/
- products/
- prompts/
- rules/
- tenant.yaml

Não existem recursos globais de negócio.

---

# Responsabilidades dos Componentes

## Evolution API

Comunicação com WhatsApp.

---

## n8n

Orquestração.

Integração entre serviços.

Disparo de eventos.

Não contém regra de negócio.

Durante o desenvolvimento poderá permanecer desativado quando não fizer parte da sprint.

---

## API

Recepção de webhooks e interface externa.

---

## Worker

Processamento assíncrono.

---

## Core

Responsável por:

- regras de negócio;
- PromptBuilder;
- contexto da conversa;
- tomada de decisão;
- integração futura com ferramentas.

---

## PostgreSQL

Persistência.

---

## Knowledge Base

Cada tenant possui sua própria base.

Local:

tenants/<tenant>/knowledge/knowledge_master.md

---

## Playbooks

Estratégia comercial do tenant.

---

## IA

Responsável por:

- interpretar mensagens;
- responder;
- tomar decisões;
- futuramente utilizar Tool Calling.

---

# Estado Atual do Projeto

Implementado:

- arquitetura multi-tenant;
- Docker Compose;
- API;
- Worker;
- Event Store;
- PostgreSQL;
- PromptBuilder;
- Message Repository;
- Lead Repository;
- Contexto de Conversa;
- MockAIProvider;
- OllamaProvider;
- Evolution Provider;
- Hotmart Provider (estrutura);
- Knowledge Base;
- Playbooks.

---

# Pendências Conhecidas

Sprint 4.2

- atualizar toda a plataforma para utilizar qwen3:4b-instruct;
- validar comportamento do novo modelo;
- manter n8n desativado enquanto não fizer parte da sprint;
- continuar evolução da camada de IA.

---

# Decisões Arquiteturais

Estas decisões devem ser preservadas.

## Lead

Lead possui UUID próprio.

Nunca utilizar telefone como chave principal.

---

## Identidade

Será criada futuramente a entidade:

lead_identities

Objetivo:

Associar um mesmo Lead aos diversos canais:

- WhatsApp;
- Hotmart;
- Telegram;
- Instagram;
- Email.

---

## IA da Plataforma

A IA da plataforma utiliza prioritariamente OpenRouter (modelo `openrouter/free`).

---

## IA de Desenvolvimento

Modelos locais não serão utilizados como cérebro do Agente de Desenvolvimento nesta fase do projeto.

O desenvolvimento continuará utilizando ChatGPT para decisões e um Agente de Desenvolvimento baseado em modelos de nuvem para implementação.

Esta decisão foi tomada após benchmark prático de desempenho.

---

## Core

Toda regra de negócio permanece no Core.

---

## n8n

Atua apenas como orquestrador.

---

## PromptBuilder

Permanece desacoplado do modelo de IA.

Recebe contexto.

Retorna apenas uma string.

---

## Histórico

O histórico deverá evoluir para conter:

- data;
- hora;
- canal;
- eventos do sistema;
- marcadores temporais.

---

# Observação Arquitetural

Existem atualmente duas pastas semelhantes:

packages/core/src/prompt

↓

Código do PromptBuilder.

packages/core/src/prompts

↓

System prompts dos tenants.

Isso é intencional.

Essas pastas NÃO devem ser removidas nem unificadas.

Existe uma refatoração planejada para uma sprint futura.

---

# Refatorações Planejadas

Renomear apenas nomenclatura.

packages/core/src/prompt

↓

packages/core/src/prompt-builder

packages/core/src/prompts

↓

packages/core/src/system-prompts

Essa alteração deverá modificar apenas diretórios e imports.

Não deverá alterar comportamento.

---

# Princípios Permanentes

Toda implementação futura deve priorizar:

1. simplicidade;
2. baixo acoplamento;
3. alta coesão;
4. extensibilidade;
5. manutenibilidade;
6. compatibilidade com futuras sprints;
7. economia de recursos;
8. estabilidade da arquitetura;
9. decisões baseadas em documentação oficial, benchmarks e experiências consolidadas da comunidade antes da adoção de novas tecnologias.

---

# Fluxo Obrigatório de Toda Sprint

1. Ler PROJECT_STATE.md.
2. Ler NEXT_SPRINT.md.
3. Analisar o código.
4. Apresentar estratégia.
5. Aguardar aprovação.
6. Implementar.
7. Executar testes.
8. Atualizar Git (quando solicitado).
9. Atualizar a documentação.