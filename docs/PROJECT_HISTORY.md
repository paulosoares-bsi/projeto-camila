# PROJECT_HISTORY

Este documento registra a evolução cronológica do Projeto Camila.

Seu objetivo é preservar o contexto das decisões tomadas durante o desenvolvimento.

O estado atual do projeto encontra-se em `docs/PROJECT_STATE.md`.

---

# Sprint 1.0

**Início:** 19/06/2026  
**Conclusão:** 22/06/2026  
**Status:** Concluída

## Objetivo

Construir a fundação técnica do Projeto Camila.

## Principais Implementações

- definição da arquitetura baseada em eventos;
- estruturação em API, Worker e Core;
- arquitetura multi-tenant;
- modelagem inicial do PostgreSQL;
- criação da estrutura inicial dos Providers;
- integração inicial com Evolution API;
- integração inicial com Hotmart;
- documentação inicial da arquitetura.

## Decisões Arquiteturais

- Core concentra toda a lógica de negócio.
- API e Worker permanecem desacoplados.
- Arquitetura preparada para múltiplos tenants.

## Lições Aprendidas

- Definir corretamente as responsabilidades desde o início reduz retrabalho.
- Recursos específicos de negócio (Knowledge Base, Playbooks, Prompts e Regras) devem permanecer sempre dentro do tenant correspondente, evitando duplicação de arquivos globais.

---

# Sprint 2.0

**Início:** 23/06/2026  
**Conclusão:** 28/06/2026  
**Status:** Concluída

## Objetivo

Estruturar o conhecimento comercial da mentoria.

## Principais Implementações

- criação da Knowledge Base;
- criação dos Playbooks;
- definição dos fluxos comerciais;
- definição das regras de Customer Success;
- definição da recuperação de carrinho;
- definição dos critérios para atendimento humano;
- organização do conteúdo institucional.

## Decisões Arquiteturais

- Knowledge Base desacoplada da implementação.
- Playbooks independentes do modelo de IA.

## Lições Aprendidas

- Conteúdo e regras de negócio devem evoluir separadamente do código.

---

# Sprint 3.0

**Início:** 28/06/2026  
**Conclusão:** 02/07/2026  
**Status:** Concluída

## Objetivo

Implementar persistência e integração dos componentes.

## Principais Implementações

- PostgreSQL configurado;
- criação das tabelas principais;
- Lead Repository;
- Message Repository;
- integração inicial com n8n;
- estruturação do fluxo de eventos;
- correção da geração automática de IDs;
- testes entre API, Worker e banco.

## Decisões Arquiteturais

- PostgreSQL como persistência oficial.
- n8n permanece apenas como orquestrador.

## Lições Aprendidas

- IDs devem ser gerados pelo banco.
- Evitar regras de negócio dentro do n8n.

---

# Sprint 4.0

**Início:** 03/07/2026  
**Conclusão:** 07/07/2026  
**Status:** Concluída

## Objetivo

Consolidar a arquitetura antes da implantação da IA.

## Principais Implementações

- Prompt Builder;
- evolução do Event Processor;
- contexto de conversa;
- reorganização dos Providers;
- revisão da arquitetura;
- consolidação da documentação;
- criação e padronização da documentação do projeto.

## Decisões Arquiteturais

- IA desacoplada da lógica de negócio.
- Prompt Builder centraliza a montagem do contexto.
- Arquitetura preparada para múltiplos modelos de IA.

## Lições Aprendidas

- Separar contexto, prompt e processamento facilita a evolução da plataforma.

---

# Sprint 4.1

**Início:** 08/07/2026  
**Conclusão:** _(preencher ao finalizar)_  
**Status:** Em andamento

## Objetivo

Implantar a primeira versão funcional da camada de IA local.

## Escopo

- integração com Ollama;
- utilização do modelo qwen3:4b;
- substituição do MockAIProvider;
- primeira resposta gerada pela IA;
- preparação da arquitetura para Tool Calling.

## Decisões Arquiteturais

- abandono definitivo das APIs externas de IA;
- Ollama adotado como runtime oficial;
- arquitetura preparada para futura troca de modelo;
- foco em baixo consumo de tokens e recursos computacionais.

---

# Roadmap

## Sprint 4.2

- Tool Calling.

## Sprint 4.3

- RAG.
- Embeddings.
- Busca semântica.

## Sprint 4.4

- Memória de longo prazo.

## Sprint 5

- Agente completo.
- Ferramentas de negócio.
- Customer Success automatizado.