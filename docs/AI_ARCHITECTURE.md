# AI Architecture

## Objetivo

Definir a arquitetura oficial da camada de Inteligência Artificial do Projeto Camila.

Esta arquitetura deve permitir:

- trocar o modelo de IA sem alterar a regra de negócio;
- suportar múltiplos providers futuramente;
- manter baixo acoplamento entre IA e aplicação;
- evoluir para Tool Calling sem refatorações estruturais.

Este documento descreve apenas a arquitetura da IA embarcada na plataforma.

A arquitetura utilizada durante o desenvolvimento encontra-se documentada em `PROJECT_STATE.md`.

---

# Princípios

A camada de IA deve obedecer aos seguintes princípios:

- nenhuma regra de negócio pertence ao modelo de IA;
- toda regra de negócio pertence ao Core;
- PromptBuilder conhece apenas contexto;
- AI Provider conhece apenas comunicação;
- o modelo apenas interpreta e responde;
- a troca do modelo nunca deve exigir alterações na lógica da aplicação.

---

# Componentes

## EventProcessor

Responsabilidades:

- receber eventos;
- identificar o tenant;
- recuperar contexto;
- solicitar construção do prompt;
- solicitar resposta ao AI Provider;
- processar Tool Calling futuramente;
- persistir eventos e mensagens.

---

## PromptBuilder

Responsabilidades:

- montar o contexto da conversa;
- incluir informações do tenant;
- incluir Playbooks;
- incluir Knowledge Base;
- produzir uma única string final para envio ao modelo.

Não deve:

- executar regras de negócio;
- conhecer o modelo utilizado.

---

## AI Provider

Responsabilidades:

- encapsular comunicação com modelos;
- converter chamadas para formato interno;
- converter respostas para formato comum;
- abstrair diferenças entre providers.

Providers previstos:

- Ollama
- OpenAI
- Anthropic
- Gemini
- DeepSeek
- futuros providers

---

## Modelo

Responsabilidades:

- interpretar o prompt;
- produzir resposta;
- executar Tool Calling quando suportado.

Nunca deve:

- acessar banco diretamente;
- conhecer regras de negócio;
- conhecer estrutura do projeto.

---

# Fluxo Oficial

```
Evento

↓

EventProcessor

↓

PromptBuilder

↓

AI Provider

↓

Modelo

↓

AI Provider

↓

EventProcessor

↓

Persistência

↓

Resposta
```

---

# Modelo Oficial

Durante a fase atual do projeto:

Runtime:

**OpenRouter**

Modelo:

**openrouter/free**

A arquitetura permanece preparada para futura migração para outros modelos hospedados em nuvem ou locais.

---

# Tool Calling

Implementado na Sprint 6.

Ferramentas disponíveis:

- `buscar_lead` – consulta dados do lead.
- `atualizar_lead` – atualiza estado do lead.
- `registrar_interesse` – registra interesse em produto/mentoria.
- `escalar_humano` – escalona para atendimento humano.
- `consultar_produto` – consulta catálogo de produtos.
- `consultar_knowledge_base` – consulta a base de conhecimento.

Fluxo oficial:

```
Modelo

↓

Tool Calling

↓

ToolRegistry (Core)

↓

Tool.execute()

↓

Resultado

↓

Modelo

↓

Resposta Final
```

O loop de Tool Calling é limitado a 5 iterações por mensagem.

---

# Fora do Escopo Atual

Não fazem parte da arquitetura implementada:

- RAG;
- Embeddings;
- Streaming;
- Memória de longo prazo;
- múltiplos modelos simultaneamente;
- agentes especializados;
- planejamento automático.

Esses recursos deverão ser adicionados sem necessidade de alterações estruturais.

---

# Evoluções Futuras

Planejadas:

- Tool Calling;
- RAG;
- Embeddings;
- Busca semântica;
- Cache de contexto;
- Memória de longo prazo;
- Suporte a múltiplos providers;
- IA hospedada em nuvem.

---

# Decisões Arquiteturais

As seguintes decisões são permanentes:

- Core concentra toda regra de negócio.
- PromptBuilder permanece desacoplado do modelo.
- AI Provider abstrai completamente o provider utilizado.
- O modelo nunca acessa diretamente banco ou serviços.
- O modelo pode ser substituído sem alterar a lógica da aplicação.
- IA da plataforma e IA utilizada durante o desenvolvimento possuem responsabilidades distintas e evoluem de forma independente.