# Como criar outro cliente

1. Crie uma pasta em `tenants/<novo-cliente-id>`.
2. Adicione `tenant.yaml`.
3. Adicione `knowledge/knowledge_master.md`.
4. Adicione regras em `rules/business_rules.yaml`.
5. Adicione playbooks em `playbooks/*.yaml`.
6. Adicione prompts em `prompts/system.md`.
7. Adicione produtos em `products/products.yaml`.
8. Cadastre o tenant no banco.

Exemplo de `tenant.yaml`:

```yaml
id: novo-cliente
name: Novo Cliente
status: active
defaultLanguage: pt-BR
timezone: America/Sao_Paulo

providers:
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

O endpoint do novo cliente ficaria:

```text
POST /webhooks/novo-cliente/message
```
