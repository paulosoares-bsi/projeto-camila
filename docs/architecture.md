# ARCHITECTURE

> Documento oficial da arquitetura do Projeto Camila.
>
> Este documento descreve como a plataforma é organizada e como seus componentes interagem.
>
> Princípios arquiteturais permanentes encontram-se em `ARCHITECTURE_PRINCIPLES.md`.

---

# Objetivo

O Projeto Camila é uma plataforma **multi-tenant**, orientada a eventos e construída para desacoplar completamente a regra de negócio das integrações externas.

A arquitetura foi projetada para permitir evolução incremental, substituição de componentes e inclusão de novos provedores sem impacto na lógica do Core.

---

# Visão Geral

A plataforma é composta pelos seguintes componentes:

```
WhatsApp
Hotmart
Outras Integrações

        │
        ▼

      API

        │

        ▼

 Event Processor

        │

        ▼

      Core

 ├── Rules Engine
 ├── PromptBuilder
 ├── Playbook Runner
 ├── Providers
 └── Persistência

        │

        ▼

    AI Provider

        │

        ▼

 Modelo de IA

        │

        ▼

 AI Provider

        │

        ▼

 Event Processor

        │

        ▼

 WhatsApp Provider
```

Toda a regra de negócio permanece concentrada no Core.

---

# Componentes

## API

Responsável por:

- receber webhooks;
- validar requisições;
- transformar eventos externos em eventos internos.

Não contém regra de negócio.

---

## Worker

Responsável pelo processamento assíncrono dos eventos.

---

## Core

É o núcleo da plataforma.

Responsável por:

- processamento de eventos;
- regras de negócio;
- gerenciamento de estados;
- montagem de prompts;
- execução de playbooks;
- persistência;
- integração entre componentes.

Toda regra de negócio pertence ao Core.

---

## Banco de Dados

Responsável pela persistência oficial da plataforma.

Armazena:

- Leads;
- Mensagens;
- Eventos;
- Compras;
- Assinaturas;
- demais entidades de negócio.

---

## n8n

Responsável apenas por orquestração.

Não deve conter regras de negócio.

---

# Arquitetura da Camada de IA

A camada de IA é composta pelos seguintes componentes.

## EventProcessor

Responsável por:

- identificar o tenant;
- recuperar contexto;
- solicitar construção do prompt;
- solicitar resposta ao AI Provider;
- persistir mensagens e eventos;
- futuramente coordenar Tool Calling.

---

## PromptBuilder

Responsável por construir o contexto enviado ao modelo.

Inclui:

- informações do tenant;
- histórico da conversa;
- Knowledge Base;
- Playbooks;
- mensagem atual.

Não executa regra de negócio.

Não conhece o modelo utilizado.

---

## AI Provider

Responsável por abstrair completamente a comunicação com o modelo de IA.

Responsabilidades:

- enviar prompts;
- receber respostas;
- normalizar formatos;
- encapsular diferenças entre providers.

A aplicação nunca conversa diretamente com um modelo.

---

## Modelo de IA

Responsável apenas por interpretar o contexto recebido e produzir uma resposta.

O modelo nunca deve:

- acessar banco de dados;
- executar regras de negócio;
- conhecer componentes internos da aplicação.

---

# Fluxo da IA

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

WhatsApp Provider
```

---

# Providers

Toda integração externa ocorre através de contratos.

Contratos atualmente previstos:

- AIProvider
- WhatsAppProvider
- PaymentProvider
- WebhookVerifier

A lógica de negócio nunca depende diretamente de:

- Ollama;
- OpenAI;
- Anthropic;
- Evolution API;
- Hotmart;
- qualquer outro fornecedor.

---

# Multi-tenancy

Toda personalização permanece dentro do tenant.

Cada tenant possui seus próprios:

- prompts;
- Knowledge Base;
- playbooks;
- regras;
- produtos;
- configurações.

O Core permanece compartilhado.

---

# Configuração

A troca de:

- provider;
- modelo;
- serviços externos;

deve ocorrer preferencialmente por configuração.

Exemplo:

```yaml
providers:
  ai:
    provider: ollama
    model: qwen3:4b-instruct
```

No futuro deverá ser possível utilizar outros providers sem alterações na regra de negócio.

---

# Evolução Prevista

A arquitetura já está preparada para incorporar futuramente:

- Tool Calling;
- RAG;
- Embeddings;
- Busca semântica;
- Memória de longo prazo;
- múltiplos providers de IA;
- modelos hospedados em nuvem.

Essas evoluções deverão ocorrer preservando a arquitetura existente.

---

# Princípios Arquiteturais

A arquitetura deve preservar permanentemente:

- baixo acoplamento;
- alta coesão;
- separação de responsabilidades;
- configuração acima de implementação;
- componentes reutilizáveis;
- evolução incremental;
- independência entre regra de negócio e provedores externos;
- compatibilidade entre tenants.
