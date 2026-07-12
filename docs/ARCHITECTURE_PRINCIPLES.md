# ARCHITECTURE_PRINCIPLES

> Registro oficial dos princípios arquiteturais permanentes do Projeto Camila.
>
> Este documento contém apenas princípios e decisões permanentes da arquitetura.
>
> Não registrar aqui:
>
> - detalhes de implementação;
> - estado atual da plataforma;
> - backlog;
> - roadmap;
> - objetivos de sprint.

---

# Objetivo

Garantir que a arquitetura do Projeto Camila permaneça consistente ao longo de sua evolução.

Este documento deve sofrer poucas alterações durante a vida do projeto.

Mudanças somente deverão ocorrer quando uma decisão arquitetural permanente for revisada.

---

# Multi-tenancy

A plataforma é nativamente multi-tenant.

Princípios:

- toda informação de negócio pertence ao tenant;
- o Core permanece compartilhado;
- personalizações devem permanecer isoladas dentro do tenant;
- não compartilhar regras de negócio entre clientes.

---

# Arquitetura Orientada a Eventos

Toda comunicação interna da plataforma ocorre através de eventos.

Princípios:

- componentes desacoplados;
- processamento assíncrono sempre que possível;
- eventos representam fatos ocorridos no domínio;
- integrações externas devem ser convertidas em eventos internos antes do processamento.

---

# Core

O Core é o único responsável pela regra de negócio.

Nunca implementar regra de negócio em:

- API;
- Worker;
- n8n;
- Providers;
- Modelo de IA.

Toda evolução funcional deve ocorrer preferencialmente dentro do Core.

---

# IA

A camada de IA deve permanecer desacoplada da aplicação.

Princípios:

- o modelo nunca implementa regra de negócio;
- PromptBuilder apenas monta contexto;
- AIProvider encapsula toda comunicação com o modelo;
- o modelo pode ser substituído sem alterações na lógica da aplicação;
- Tool Calling deverá ser implementado preservando essa separação.

---

# Providers

Toda integração externa deve ocorrer através de contratos bem definidos.

Princípios:

- nenhum componente do Core deve depender diretamente de fornecedores externos;
- novos providers devem ser adicionados sem impacto na regra de negócio;
- diferenças entre fornecedores devem permanecer encapsuladas nos Providers.

---

# Banco de Dados

Princípios:

- Leads possuem identificador próprio (UUID);
- telefone nunca é chave primária;
- diferentes canais de comunicação deverão convergir futuramente através da entidade `lead_identities`;
- persistência permanece independente dos Providers.

---

# n8n

O n8n possui responsabilidade exclusivamente de orquestração.

Princípios:

- não implementar regra de negócio;
- não substituir responsabilidades do Core;
- atuar apenas como integrador entre serviços.

---

# Knowledge Base

Cada tenant possui sua própria Knowledge Base.

Princípios:

- não existe Knowledge Base global;
- conhecimento pertence exclusivamente ao tenant;
- a evolução do conteúdo deve ocorrer independentemente da aplicação.

---

# Playbooks

Playbooks pertencem exclusivamente ao tenant.

Princípios:

- não compartilhar playbooks entre clientes;
- playbooks representam comportamento de negócio, não implementação técnica.

---

# Configuração

Sempre preferir configuração à implementação.

Mudanças de:

- modelos;
- providers;
- integrações externas;
- parâmetros operacionais;

devem ocorrer preferencialmente por configuração, evitando alterações de código.

---

# Princípios Gerais

Toda evolução arquitetural deverá preservar:

- simplicidade;
- baixo acoplamento;
- alta coesão;
- separação de responsabilidades;
- arquitetura evolutiva;
- componentes reutilizáveis;
- configuração acima de implementação;
- compatibilidade entre tenants;
- facilidade de manutenção.

---

# Alteração dos Princípios

Os princípios deste documento somente poderão ser alterados quando:

1. houver necessidade arquitetural comprovada;
2. a mudança for discutida e aprovada;
3. o impacto sobre a plataforma for avaliado;
4. a alteração for registrada no `PROJECT_HISTORY.md`.

Mudanças ocasionais de implementação não justificam alterações neste documento.