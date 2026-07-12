# DEVELOPMENT_WORKFLOW

> Documento oficial do fluxo de desenvolvimento do Projeto Camila.
>
> Todo desenvolvedor, ChatGPT ou Agente de Desenvolvimento deve seguir este documento antes de realizar alterações no projeto.

---

# Objetivo

Padronizar o fluxo de desenvolvimento do Projeto Camila.

Este documento existe para evitar inferências, reduzir retrabalho, economizar tokens e manter previsibilidade durante todas as sprints.

Sempre que existir divergência entre convenções genéricas de mercado e este documento, este documento possui prioridade.

---

# Filosofia de Desenvolvimento

O desenvolvimento do Projeto Camila prioriza:

- simplicidade;
- previsibilidade;
- baixo acoplamento;
- economia de recursos;
- documentação sempre atualizada;
- alterações pequenas e validadas.

Arquitetura é definida antes da implementação.

Implementação é validada antes da próxima alteração.

---

# Fluxo Oficial de Desenvolvimento

Toda alteração deverá seguir obrigatoriamente esta sequência.

1. Ler a documentação obrigatória.
2. Auditar o código relacionado ao escopo.
3. Definir arquitetura.
4. Aguardar aprovação.
5. Implementar apenas o escopo aprovado.
6. Validar.
7. Atualizar documentação.
8. Commit.

Nunca pular etapas.

---

# Documentação Obrigatória

Antes de iniciar qualquer sprint, ler obrigatoriamente:

- docs/PROJECT_STATE.md
- docs/PROJECT_PHILOSOPHY.md
- docs/ARCHITECTURE.md
- docs/ARCHITECTURE_PRINCIPLES.md
- docs/DEVELOPMENT_WORKFLOW.md
- docs/NEXT_SPRINT.md
- docs/PROJECT_HISTORY.md

Consultar quando necessário:

- docs/BACKLOG.md
- docs/local-development.md
- docs/hotmart-webhooks.md
- docs/how-to-add-tenant.md
- docs/O que a Camila precisa.txt

O código-fonte continua sendo a fonte da verdade.

---

# Responsabilidades

## ChatGPT

Ferramenta principal de desenvolvimento do projeto.

Responsável por:

- auditoria técnica;
- pesquisa;
- arquitetura;
- planejamento;
- revisão de código;
- investigação de problemas;
- elaboração e revisão da documentação;
- identificar inconsistências;
- definir escopo de implementação;
- produzir instruções objetivas;
- orientar alterações manuais sempre que possível.

Sempre que uma alteração puder ser realizada manualmente pelo desenvolvedor com segurança, ela deverá permanecer neste fluxo.

---

## Agente de Desenvolvimento (Codex)

Utilizar apenas quando houver ganho real de produtividade.

Exemplos:

- implementação envolvendo muitos arquivos;
- alterações repetitivas;
- geração de grande volume de código;
- refatorações extensas;
- tarefas cujo custo manual seja maior que o custo do Agente.

O Agente não deve ser utilizado para pequenas alterações que possam ser realizadas manualmente.

---

# Economia de Recursos

Sempre priorizar:

- menor consumo de tokens;
- menor quantidade de chamadas ao Agente;
- alterações manuais quando simples;
- reutilização de contexto;
- prompts objetivos;
- documentação clara.

Antes de utilizar o Agente de Desenvolvimento, o ChatGPT deverá avaliar se a alteração pode ser realizada manualmente.

Na dúvida, priorizar o fluxo manual.

---

# Infraestrutura Oficial

Durante o desenvolvimento utilizar:

- Docker Compose
- PostgreSQL em Docker
- API em Docker
- Worker em Docker
- n8n em Docker
- Ollama executando no host Windows

Não assumir arquiteturas diferentes sem confirmação.

---

# Fluxo Oficial de Testes

Os testes manuais oficiais são executados utilizando os arquivos da pasta:

```
requests/
```

através da extensão **REST Client** do Visual Studio Code.

Os arquivos `.http` representam a suíte oficial de testes da API.

Sempre preferir estes testes antes de criar scripts temporários.

---

# Fluxo de Alteração de Código

Após qualquer alteração em código TypeScript:

1.

```
pnpm typecheck
```

2.

Caso necessário:

```
docker compose up -d --build
```

3.

Executar o teste correspondente em:

```
requests/
```

4.

Consultar logs quando necessário.

---

# Quando utilizar restart

Utilizar:

```
docker compose restart
```

quando forem alterados apenas arquivos de configuração carregados durante a inicialização.

Exemplos:

- tenant.yaml
- platform.config.yaml
- .env

---

# Quando utilizar --build

Utilizar:

```
docker compose up -d --build
```

quando forem alterados:

- arquivos TypeScript;
- package.json;
- pnpm-lock.yaml;
- Dockerfile;
- dependências.

---

# Debug

Comandos úteis:

```
pnpm typecheck
```

```
docker compose up -d --build
```

```
docker compose restart api
```

```
docker compose restart worker
```

```
docker compose logs api --tail=100
```

```
docker compose logs worker --tail=100
```

---

# Fluxo de Documentação

Ao concluir uma sprint atualizar, quando necessário:

- PROJECT_STATE.md
- PROJECT_HISTORY.md
- NEXT_SPRINT.md
- DEVELOPMENT_WORKFLOW.md
- BACKLOG.md

Documentação faz parte da Definition of Done.

---

# Fluxo de Git

Sequência padrão:

1. validar alterações;
2. revisar documentação;
3. commit;
4. push.

Não realizar commit antes da validação.

---

# Regras para ChatGPT

Antes de responder:

- ler toda a documentação obrigatória;
- utilizar o código como fonte da verdade;
- nunca assumir convenções do ecossistema;
- consultar primeiro a documentação do projeto;
- quando houver dúvida sobre ambiente, perguntar antes de inferir;
- propor apenas uma alteração por vez;
- validar cada alteração antes da próxima;
- evitar overengineering;
- evitar otimizações prematuras;
- preservar a arquitetura existente;
- separar claramente arquitetura, implementação e validação;
- distinguir responsabilidades entre ChatGPT e Agente de Desenvolvimento.

---

# Regras para o Agente de Desenvolvimento

O Agente deverá:

- implementar apenas o escopo aprovado;
- preservar a arquitetura;
- não alterar componentes estáveis sem necessidade;
- não tomar decisões arquiteturais;
- executar testes antes de concluir;
- informar arquivos alterados.

---

# Definition of Done

Uma tarefa somente será considerada concluída quando:

- implementação concluída;
- validação executada;
- documentação atualizada;
- arquitetura preservada;
- Git preparado para commit.

---

# Backlog Técnico

Melhorias futuras:

- adicionar bind mount para API e Worker durante desenvolvimento, eliminando rebuilds desnecessários;
- validar automaticamente a configuração do modelo Ollama durante o startup;
- melhorar mensagens de erro de infraestrutura;
- implementar RAG apenas quando houver necessidade comprovada por limitações reais da Knowledge Base.

---

# Princípio Fundamental

Quando existir qualquer dúvida operacional:

**Perguntar é melhor do que inferir.**

Quando existir qualquer divergência:

**O código é a fonte da verdade.**

Quando existir mais de uma solução possível:

**Preferir a mais simples que atenda aos requisitos atuais.**