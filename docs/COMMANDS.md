# COMMANDS

Este documento reúne os principais comandos utilizados durante o desenvolvimento do Projeto Camila.

Sempre execute os comandos no terminal integrado do Visual Studio Code, salvo quando indicado o contrário.

---

# Git

**Onde executar**

- Git Bash
- PowerShell
- Terminal do VS Code

**Diretório**

Raiz do projeto.

## Verificar estado

```bash
git status
```

## Ver histórico

```bash
git log --oneline --graph --decorate
```

## Ver diferenças

```bash
git diff
```

## Adicionar alterações

```bash
git add .
```

## Commit

```bash
git commit -m "mensagem"
```

## Enviar para o GitHub

```bash
git push
```

## Buscar alterações

```bash
git pull
```

## Criar uma branch

```bash
git switch -c sprint-4.2
```

## Trocar de branch

```bash
git switch main

git switch sprint-4.2
```

## Listar branches

```bash
git branch
```

## Mesclar branch

```bash
git switch main

git merge sprint-4.2
```

---

# Docker

**Onde executar**

- PowerShell
- Git Bash
- Terminal do VS Code

**Diretório**

Raiz do projeto.

## Containers em execução

```bash
docker ps
```

## Todos os containers

```bash
docker ps -a
```

## Subir ambiente completo

```bash
docker compose up -d
```

## Ambiente mínimo

Quando a sprint não envolver o n8n:

```bash
docker compose up -d postgres api worker
```

## Reconstruir ambiente

```bash
docker compose up --build -d
```

## Reiniciar ambiente

```bash
docker compose restart
```

## Parar ambiente

```bash
docker compose down
```

## Destruir ambiente

```bash
docker compose down -v --remove-orphans
```

## Logs gerais

```bash
docker compose logs -f
```

## Logs da API

```bash
docker compose logs -f api
```

## Logs do Worker

```bash
docker compose logs -f worker
```

## Logs do n8n

```bash
docker compose logs -f n8n
```

---

# Ollama

**Onde executar**

- PowerShell
- Git Bash
- Terminal do VS Code

**Diretório**

Qualquer pasta.

## Modelos instalados

```bash
ollama list
```

## Modelo carregado

```bash
ollama ps
```

## Informações do modelo

```bash
ollama show qwen3:4b-instruct
```

## Executar modelo

```bash
ollama run qwen3:4b-instruct
```

## Atualizar modelo

```bash
ollama pull qwen3:4b-instruct
```

## Remover modelo antigo

```bash
ollama rm qwen3:4b
```

## Testar API nativa

```bash
curl http://localhost:11434/api/tags
```

## Testar API compatível com OpenAI

```bash
curl http://localhost:11434/v1/models
```

---

# PNPM

**Onde executar**

Terminal do VS Code.

**Diretório**

Raiz do projeto.

## Instalar dependências

```bash
pnpm install
```

## Verificação de tipos

```bash
pnpm typecheck
```

## Criar banco de dados

```bash
pnpm db:create
```

## Aplicar migrations

```bash
pnpm db:migrate
```

## Executar API (desenvolvimento)

```bash
pnpm dev:api
```

## Executar Worker (desenvolvimento)

```bash
pnpm dev:worker
```

## Executar Smoke Test

```bash
pnpm smoke:message
```

## Listar scripts disponíveis

```bash
pnpm run
```

---

# PostgreSQL

## Criar banco

```bash
node scripts/create-database.mjs
```

## Aplicar migrations

```bash
node scripts/apply-migrations.mjs
```

---

# Projeto

## Validar projeto

```bash
pnpm typecheck
```

## Subir ambiente completo

```bash
docker compose up -d
```

## Subir ambiente mínimo

```bash
docker compose up -d postgres api worker
```

## Reconstruir ambiente

```bash
docker compose up --build -d
```

## Parar ambiente

```bash
docker compose down
```

---

# Fluxo Oficial de uma Sprint

```text
1. git pull

2. git switch -c sprint-x.x

3. ChatGPT
   - auditoria
   - pesquisa
   - arquitetura
   - planejamento
   - geração do prompt

4. Agente de Desenvolvimento
   - implementação
   - testes

5. pnpm typecheck

6. git add .

7. git commit -m "tipo: descrição"

8. git push -u origin sprint-x.x

9. ChatGPT
   - auditoria final
   - atualização da documentação
```