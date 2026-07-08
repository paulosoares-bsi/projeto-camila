# PROJECT_STATE

# ⚠️ Instruções para IA / Codex

Este documento representa o estado oficial do Projeto Camila.

Antes de realizar qualquer alteração:

1. Leia integralmente este documento.
2. Analise o código-fonte do repositório.
3. Em caso de divergência entre este documento e o código, considere o código como fonte da verdade e registre a divergência antes de prosseguir.
4. Consulte o PROJECT_HISTORY.md apenas quando precisar compreender decisões arquiteturais ou a evolução do projeto.
5. Não proponha alterações arquiteturais que contrariem as decisões registradas neste documento sem apresentar justificativa técnica.
6. Ao concluir a sprint, atualize este documento refletindo o novo estado do projeto e registre a evolução no PROJECT_HISTORY.md.

---

## Economia de Recursos

Toda implementação deve priorizar:

- mínimo consumo de tokens da IA;
- mínimo consumo de CPU;
- mínimo consumo de RAM;
- mínimo número de chamadas ao modelo;
- reutilização de contexto sempre que possível;
- prompts curtos e objetivos;
- evitar processamento desnecessário.

# Objetivo

O Projeto Camila é uma plataforma de atendimento inteligente via WhatsApp para comercialização e suporte da Mentoria Camila Quinderé.

A plataforma deverá ser capaz de:

- atender leads automaticamente;
- conduzir vendas;
- executar playbooks comerciais;
- realizar Customer Success;
- consultar Knowledge Base;
- utilizar IA local;
- evoluir para um agente baseado em Tool Calling.

---

# Arquitetura Atual

## Stack

- Evolution API
- n8n
- PostgreSQL
- Ollama
- Knowledge Base
- Playbooks

## Organização dos Tenants

Cada tenant possui seus próprios recursos de negócio.

Estrutura:

tenants/<tenant>/

- knowledge/
- playbooks/
- products/
- prompts/
- rules/
- tenant.yaml

Não existem recursos globais de negócio na raiz do projeto.

## Modelo de IA

Runtime:

Ollama

Modelo atual:

qwen3:4b

Endpoint:

http://localhost:11434

A arquitetura deve permanecer preparada para troca futura do modelo de IA sem alterações relevantes na lógica de negócio.

---

# Responsabilidades dos Componentes

## Evolution API

- comunicação com WhatsApp

## n8n

- orquestração dos fluxos
- integração entre serviços
- disparo de eventos

## API

- interface externa

## Worker

- processamento assíncrono

## Core

- regras de negócio
- contexto da conversa
- construção de prompts
- tomada de decisão
- futura integração com ferramentas

## PostgreSQL

- persistência

## Knowledge Base

Cada tenant possui sua própria Knowledge Base.

Localização:

tenants/<tenant>/knowledge/knowledge_master.md

A IA deve utilizar exclusivamente a Knowledge Base do tenant ativo.

Não existe Knowledge Base global.

## Playbooks

- estratégia comercial

## IA

Responsável por:

- interpretar mensagens;
- tomar decisões;
- gerar respostas;
- futuramente utilizar Tool Calling.

---

# Componentes Implementados

Atualmente o projeto possui:

- arquitetura multi-tenant
- API
- Worker
- Event Processor
- Prompt Builder
- PostgreSQL
- Evolution Provider
- Hotmart Provider
- Lead Repository
- Message Repository
- Contexto de Conversa
- Knowledge Base
- Playbooks

---

# Componentes Pendentes

Próximas evoluções previstas:

- AI Provider Local
- Tool Calling
- RAG
- Embeddings
- Busca Semântica
- Memória de longo prazo
- Customer Success automatizado
- Recuperação de carrinho
- Agente completo

---

# Decisões Arquiteturais

Estas decisões devem ser preservadas:

- IA exclusivamente local.
- Ollama é o runtime oficial.
- Modelo inicial: qwen3:4b.
- Arquitetura preparada para futura migração para qwen3:8b.
- Não utilizar APIs externas de IA.
- Toda regra de negócio permanece no Core.
- O n8n atua apenas como orquestrador.
- A IA deve evoluir para utilização de Tool Calling.
- Evitar grandes cadeias de IFs no n8n.
- Priorizar simplicidade.
- Evitar overengineering.
- Priorizar baixo consumo de CPU.
- Priorizar baixo consumo de memória.
- Priorizar baixo consumo de tokens.
- Toda personalização de negócio pertence ao tenant.

---

# Princípios Permanentes

Toda implementação futura deve priorizar:

1. simplicidade;
2. manutenibilidade;
3. baixo acoplamento;
4. alta coesão;
5. extensibilidade;
6. compatibilidade com futuras sprints;
7. economia de recursos;
8. economia de tokens.

---

## Fluxo obrigatório de toda Sprint

1. Ler este documento.
2. Ler o NEXT_SPRINT.md.
3. Analisar o código.
4. Propor a estratégia.
5. Aguardar aprovação.
6. Implementar.
7. Atualizar a documentação.