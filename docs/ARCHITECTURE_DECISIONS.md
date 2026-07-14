# ARCHITECTURE_DECISIONS

> Registro oficial das decisões arquiteturais permanentes do Projeto Camila.
>
> Este documento contém apenas decisões consolidadas.
> Não registrar ideias, hipóteses ou itens de backlog.

---

# Objetivo

Centralizar decisões arquiteturais que deverão permanecer válidas durante todo o ciclo de vida do projeto.

Mudanças neste documento devem ser raras.

---

# Arquitetura Geral

## Multi-tenant

A plataforma é multi-tenant.

Toda personalização deve permanecer dentro do tenant.

O Core permanece compartilhado.

---

## Arquitetura orientada a eventos

Toda comunicação interna ocorre através de eventos.

Os componentes devem permanecer desacoplados.

---

## Core

Toda regra de negócio pertence ao Core.

Nunca implementar regra de negócio em:

- API;
- Worker;
- n8n;
- Providers;
- IA.

---

# IA

## Separação de responsabilidades

Existem duas inteligências independentes.

### IA da Plataforma

Responsável pelo atendimento dos clientes.

Runtime oficial:

- OpenRouter

Modelo oficial:

- openrouter/free

---

### IA de Desenvolvimento

Responsável pelo desenvolvimento do software.

Nesta fase do projeto:

- ChatGPT → arquitetura, auditoria e planejamento.
- Agente de Desenvolvimento → implementação.

Modelos locais não fazem parte da arquitetura oficial de desenvolvimento nesta fase.

---

## Prompt Builder

O PromptBuilder apenas monta contexto.

Ele não executa regras de negócio.

---

## Providers

Todo provider deve implementar um contrato.

A troca do provider nunca deve exigir alterações na regra de negócio.

---

# Banco de Dados

Telefone não deve ser utilizado como chave principal.

Cada Lead possui identificador próprio.

A associação entre diferentes canais deverá ocorrer futuramente através da entidade `lead_identities`.

---

# n8n

O n8n atua apenas como orquestrador.

Não deve conter regra de negócio.

---

# Knowledge Base

Cada tenant possui sua própria Knowledge Base.

Não existe Knowledge Base global.

---

# Playbooks

Playbooks pertencem ao tenant.

Não compartilhar playbooks entre clientes.

---

# Configuração

A troca de:

- modelo;
- provider;
- serviços externos;

deve ocorrer preferencialmente por configuração.

Evitar alterações no código.

---

# Princípios Arquiteturais

As seguintes regras devem ser preservadas:

- baixo acoplamento;
- alta coesão;
- simplicidade;
- arquitetura evolutiva;
- componentes reutilizáveis;
- configuração acima de implementação.

---

# Alterações

Toda alteração arquitetural deverá:

1. ser discutida;
2. ser aprovada;
3. atualizar este documento;
4. atualizar o PROJECT_HISTORY quando relevante.