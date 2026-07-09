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
- Nunca considerar `node_modules` parte do backup do projeto. Em caso de movimentação entre discos ou criação de arquivos ZIP, remover `node_modules` e reconstruí-lo posteriormente com `pnpm install`. Isso evita problemas com links simbólicos do PNPM e reduz drasticamente o tamanho dos backups.

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
**Conclusão:** 09/07/2026  
**Status:** Concluída

## Objetivo

Implantar a primeira versão funcional da camada de IA local da plataforma.

## Escopo

- integração com Ollama;
- substituição do MockAIProvider;
- primeira resposta gerada pela IA;
- preparação da arquitetura para Tool Calling;
- benchmark de agentes de desenvolvimento utilizando modelos locais.

## Principais Implementações

- criação do OllamaProvider;
- integração na factory de providers;
- uso da API oficial do Ollama;
- atualização do modelo oficial para **qwen3:4b-instruct**;
- manutenção do MockAIProvider para testes;
- consolidação da arquitetura preparada para futura troca de modelo.

## Benchmark Realizado

Foram avaliadas as seguintes alternativas para utilização de IA local como agente de desenvolvimento:

- Codex + Ollama;
- Cline + Ollama;
- Aider + Ollama.

### Resultado

- Codex + Ollama apresentou problemas de integração e reconexão.
- Cline funcionou, porém consumiu contexto excessivo para um modelo de 4B.
- Aider apresentou melhor arquitetura, porém desempenho insuficiente para o porte do projeto, com tarefas simples levando vários minutos e tarefas maiores atingindo timeout.

## Decisões Arquiteturais

- Ollama adotado como runtime oficial da IA da plataforma.
- Modelo oficial atualizado para **qwen3:4b-instruct**.
- A arquitetura permanece preparada para futura troca de modelo.
- A IA utilizada pela plataforma passa a ser tratada separadamente da IA utilizada durante o desenvolvimento.
- Modelos locais **não serão utilizados como cérebro do Agente de Desenvolvimento** nesta fase do projeto.
- O desenvolvimento continuará utilizando ChatGPT para arquitetura e decisões, aliado a um Agente de Desenvolvimento baseado em modelos de nuvem para implementação.

## Lições Aprendidas

- IA da plataforma e IA de desenvolvimento possuem requisitos diferentes e devem evoluir independentemente.
- Antes da adoção de uma nova tecnologia devem ser avaliados:
  - documentação oficial;
  - benchmarks independentes;
  - experiências consolidadas da comunidade;
  - compatibilidade com o hardware disponível.
- Benchmarks próprios devem ser realizados apenas após essa análise inicial.
- Economia de tokens isoladamente não justifica a adoção de uma solução que aumente significativamente o tempo de desenvolvimento.

---

# Roadmap

## Sprint 4.2

- atualização completa da plataforma para `qwen3:4b-instruct`;
- validação do comportamento do novo modelo;
- início da evolução para Tool Calling;
- otimização do Provider Ollama;
- manutenção do n8n desativado enquanto não fizer parte da sprint.

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