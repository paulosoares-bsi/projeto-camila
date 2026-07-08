# AGENTS.md

Instrucoes para o Codex ao abrir este projeto.

## Objetivo

Este repositorio e uma plataforma multi-tenant de automacao comercial orientada a eventos, com API Express/TypeScript, workers, Postgres, configuracoes por tenant e integracoes como Hotmart.

## Leia primeiro

- `README.md`: visao geral, estrutura e comandos locais.
- `package.json`: scripts disponiveis e dependencias.
- `docs/architecture.md`: arquitetura quando a tarefa envolver desenho tecnico.
- `docs/local-development.md`: execucao local e ambiente.
- `docs/how-to-add-tenant.md`: tarefas de tenant.
- `docs/hotmart-webhooks.md`: tarefas de webhook Hotmart.

## Evite gastar tokens

- Nao leia `knowledge_master.md` inteiro por padrao; use `rg` para buscar termos especificos.
- Nao leia `node_modules/`, `dist/`, `.pnpm-store/` ou logs, exceto quando a tarefa exigir.
- Prefira `rg` e `rg --files` para localizar arquivos e referencias.
- Leia apenas os arquivos diretamente relacionados ao pedido antes de editar.

## Estrutura principal

- `apps/api/`: API, webhooks, servidor e worker.
- `packages/core/`: nucleo reutilizavel e regras compartilhadas.
- `config/`: configuracao global da plataforma.
- `tenants/`: configuracoes por cliente.
- `database/migrations/`: schema e migracoes Postgres.
- `workflows/n8n/`: documentacao dos fluxos n8n.
- `scripts/`: utilitarios de banco, smoke tests e execucao local.

## Comandos uteis

- `pnpm typecheck`: valida TypeScript.
- `pnpm dev:api`: inicia a API local.
- `pnpm dev:worker`: inicia o worker local.
- `pnpm db:create`: cria o banco configurado.
- `pnpm db:migrate`: aplica migracoes.
- `pnpm smoke:message`: executa smoke test de mensagem.

Use `npm run <script>` somente se o usuario pedir ou se `pnpm` nao estiver disponivel.

## Regras de edicao

- Preserve o padrao TypeScript ESM do projeto.
- Mantenha mudancas pequenas e alinhadas ao modulo afetado.
- Nao altere `.env` nem segredos; use `.env.example` para documentar variaveis.
- Nao reescreva configuracoes de tenant sem conferir o arquivo do tenant afetado.
- Nao reverta alteracoes existentes do usuario.

## Validacao

- Para mudancas de codigo TypeScript, rode `pnpm typecheck` quando possivel.
- Para alteracoes de banco, confira scripts em `scripts/` e migracoes em `database/migrations/`.
- Para webhooks ou fluxo de mensagem, considere `pnpm smoke:message` se o ambiente local estiver configurado.

## Regras gerais

- Seja extremamente conciso.
- Nunca explique o código, a menos que eu peça.
- Gere apenas os arquivos solicitados.
- Não modifique arquivos não relacionados.
- Não faça refatorações sem autorização.
- Preserve o estilo de código existente.
- Sempre reutilize componentes existentes antes de criar novos.
- Ao corrigir bugs, altere o mínimo possível.

## Respostas

- Prefira diffs.
- Não gere arquivos completos se apenas algumas linhas mudaram.
- Se precisar criar arquivos, informe primeiro quais serão.