# Como adicionar um novo Tenant

Este documento descreve o processo oficial para adicionar um novo cliente (tenant) ao Projeto Camila.

Toda personalização de negócio deve permanecer isolada dentro da pasta do tenant.

---

# Estrutura

Criar a seguinte estrutura:

```text
tenants/
└── <tenant-id>/
    ├── tenant.yaml
    ├── knowledge/
    │   └── knowledge_master.md
    ├── rules/
    │   └── business_rules.yaml
    ├── playbooks/
    │   └── sales.yaml
    ├── prompts/
    │   └── system.md
    └── products/
        └── products.yaml
```

---

# Arquivos obrigatórios

## tenant.yaml

Contém as configurações do tenant.

Exemplo:

```yaml
id: novo-cliente
name: Novo Cliente
status: active
defaultLanguage: pt-BR
timezone: America/Sao_Paulo

providers:
  ai:
    provider: ollama
    model: qwen3:4b-instruct

  whatsapp:
    instance: novo-cliente

knowledge:
  main: knowledge/knowledge_master.md

rules:
  main: rules/business_rules.yaml

playbooks:
  - playbooks/sales.yaml

prompts:
  system: prompts/system.md

products:
  main: products/products.yaml
```

---

## knowledge/knowledge_master.md

Base de conhecimento completa do cliente.

Deve conter:

- informações institucionais;
- perguntas frequentes;
- regras comerciais;
- diferenciais;
- políticas;
- informações que poderão ser utilizadas pela IA.

---

## rules/business_rules.yaml

Regras de negócio específicas do tenant.

Exemplos:

- quando escalar para humano;
- quando iniciar Customer Success;
- regras de follow-up;
- regras comerciais.

---

## playbooks/

Fluxos comerciais do cliente.

Exemplos:

- vendas;
- onboarding;
- recuperação;
- Customer Success;
- reembolso.

---

## prompts/system.md

Prompt base utilizado pelo PromptBuilder.

Não deve conter conhecimento de negócio duplicado.

O conhecimento deve permanecer na Knowledge Base.

---

## products/products.yaml

Cadastro dos produtos vendidos pelo cliente.

---

# Banco de Dados

Após criar os arquivos, cadastrar o tenant no banco de dados.

O identificador utilizado deve ser exatamente o mesmo informado em:

```yaml
id:
```

---

# Endpoint

Após o cadastro, o endpoint ficará disponível em:

```text
POST /webhooks/<tenant-id>/message
```

Exemplo:

```text
POST /webhooks/camila-quindere/message
```

---

# Checklist

Antes de considerar o tenant pronto, verificar:

- [ ] Pasta criada.
- [ ] tenant.yaml criado.
- [ ] Knowledge Base criada.
- [ ] Regras criadas.
- [ ] Playbooks criados.
- [ ] Prompt criado.
- [ ] Produtos cadastrados.
- [ ] Tenant cadastrado no banco.
- [ ] Endpoint validado.
- [ ] Primeira mensagem testada.

---

# Princípios

Todo tenant deve ser independente.

Não compartilhar:

- Knowledge Base;
- Playbooks;
- Prompts;
- Produtos;
- Regras de negócio.

A única parte compartilhada entre tenants deve ser o Core da aplicação.