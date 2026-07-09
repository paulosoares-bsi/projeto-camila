# BACKLOG

Este documento registra melhorias, ideias e decisões adiadas deliberadamente.

Itens deste backlog **não fazem parte da sprint atual** e não devem ser implementados sem solicitação explícita.

---

# Arquitetura

## CODEBASE_INDEX

Criar futuramente `docs/CODEBASE_INDEX.md`.

Objetivo:

Reduzir o custo de contexto do Agente de Desenvolvimento indicando rapidamente onde cada responsabilidade está localizada.

Exemplo:

- API
- Worker
- Events
- Prompt Builder
- Providers
- Database
- Rules
- Tenant
- Knowledge Base
- Playbooks

Espera-se reduzir exploração desnecessária do repositório e economizar recursos durante o desenvolvimento.

---

## AI Adapter

A arquitetura já está sendo preparada para suportar múltiplos modelos.

No momento será utilizado apenas Ollama.

Criar posteriormente um AI Adapter genérico permitindo utilizar, sem alterar a lógica de negócio:

- Ollama
- OpenAI
- Gemini
- Claude
- DeepSeek
- outros

---

## Tool Calling

Evoluir a IA de simples geração de texto para agente executor de ferramentas.

Ferramentas previstas:

- buscar_lead
- atualizar_lead
- consultar_produto
- consultar_knowledge_base
- enviar_video
- registrar_interesse
- escalar_humano
- registrar_atendimento

---

# Requests

## ollama.http

Expandir futuramente `requests/ollama.http` adicionando testes da arquitetura do Projeto Camila.

Adicionar:

- teste do endpoint interno da API do Projeto Camila utilizando Ollama;
- testes específicos do modelo `qwen3:4b-instruct`;
- testes de Tool Calling;
- testes de prompts do sistema;
- testes de contexto longo;
- testes de saída estruturada (JSON).

---

# Conhecimento

## RAG

Implementar busca semântica utilizando a Knowledge Base do tenant.

Avaliar posteriormente:

- chunking;
- embeddings;
- reranking;
- cache de contexto.

---

# Multi-tenant

Revisar toda nova funcionalidade verificando se permanece independente por tenant.

Evitar recursos globais de negócio.

Toda personalização deverá permanecer dentro de:

```
tenants/<tenant>/
```

---

# Observabilidade

Adicionar posteriormente:

- logs estruturados;
- métricas;
- tracing;
- monitoramento do consumo de IA;
- tempo médio de resposta;
- consumo de CPU;
- consumo de memória;
- quantidade de tokens.

---

# Testes

Criar suíte de smoke tests para:

- API;
- Worker;
- Ollama;
- Evolution;
- Hotmart;
- n8n.

Sempre que possível utilizando REST Client.

Criar também testes específicos para:

- Prompt Builder;
- Ollama Provider;
- montagem de contexto;
- seleção de Playbooks;
- carregamento da Knowledge Base.

---

# Documentação

Avaliar criação futura de:

- troubleshooting.md;
- deployment.md;
- operations.md.

Somente quando houver necessidade real.

Evitar documentação desnecessária.

---

# Performance

Avaliar posteriormente:

- cache da Knowledge Base;
- cache de prompts;
- cache de embeddings;
- lazy loading de documentos;
- redução do consumo de contexto;
- carregamento incremental de contexto.

---

# IA

## Migração para modelos em nuvem

Quando a fase de desenvolvimento e validação for concluída, avaliar a migração da IA da plataforma para modelos hospedados em nuvem.

Objetivos:

- maior qualidade de resposta;
- menor latência percebida pelo usuário;
- utilização de Tool Calling nativo;
- maior capacidade de raciocínio.

A arquitetura atual já deverá permitir essa substituição sem impacto na regra de negócio.

---

## Benchmark

Antes da adoção de novos modelos ou agentes deverão ser avaliados:

- documentação oficial;
- benchmarks independentes;
- experiências consolidadas da comunidade;
- compatibilidade com o hardware disponível;
- custo operacional;
- facilidade de reversão.

Somente após essa avaliação deverá ser realizado benchmark interno.

---

# Ideias

## Versionamento da Knowledge Base

Avaliar mecanismo para versionar a Knowledge Base dos tenants.

Objetivo:

Permitir evolução do conteúdo sem perda de histórico.

---

## Prompt Builder

Avaliar otimizações futuras visando:

- menor consumo de recursos;
- reutilização de contexto;
- montagem dinâmica de prompts;
- inclusão automática apenas das informações necessárias para cada atendimento.