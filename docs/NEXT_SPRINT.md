# NEXT_SPRINT

Este documento representa exclusivamente o objetivo da sprint atual.

Ao término da sprint ele deverá ser substituído pelo conteúdo da próxima sprint.

## Sprint

4.2

---

# Objetivo

Consolidar a primeira versão funcional da camada de IA da plataforma utilizando Ollama e estabelecer um fluxo de desenvolvimento previsível, documentado e de baixo custo entre ChatGPT e o Agente de Desenvolvimento.

---

# Escopo

Esta sprint contempla apenas:

- validar a integração da plataforma com o Ollama;
- oficializar o modelo `qwen3:4b-instruct`;
- revisar o fluxo de construção de prompts;
- validar o fluxo completo da camada de IA;
- consolidar a documentação técnica do projeto;
- oficializar o novo fluxo de desenvolvimento.

---

# Critérios de Aceite

Ao final da sprint deverá ser possível:

- receber uma mensagem da API;
- persistir os dados necessários;
- construir corretamente o contexto da conversa;
- montar o prompt;
- enviar o prompt ao Ollama;
- receber a resposta do modelo;
- devolver a resposta ao fluxo existente;
- manter desacoplamento entre a regra de negócio e o modelo utilizado;
- manter a documentação consistente com a implementação.

---

# Restrições

Não faz parte desta sprint:

- alterar componentes estáveis sem necessidade;
- modificar a arquitetura existente;
- criar overengineering;
- implementar Tool Calling;
- implementar RAG;
- implementar Embeddings;
- implementar Memória de Longo Prazo;
- mover regras de negócio para o n8n.

Priorizar sempre:

- simplicidade;
- estabilidade;
- facilidade de manutenção;
- baixo acoplamento;
- economia de recursos.

---

# Fluxo Oficial da Sprint

Toda atividade deverá seguir obrigatoriamente:

1. Auditoria.
2. Pesquisa (quando necessária).
3. Arquitetura.
4. Planejamento.
5. Aprovação.
6. Implementação.
7. Testes.
8. Git.
9. Atualização da documentação.

---

# Forma de Trabalho

Durante esta sprint:

- ChatGPT é a principal ferramenta de desenvolvimento;
- alterações pequenas deverão ser realizadas manualmente pelo desenvolvedor sempre que possível;
- o Agente de Desenvolvimento será utilizado apenas quando houver ganho real de produtividade;
- o código-fonte permanece como fonte da verdade;
- o fluxo oficial encontra-se em `docs/DEVELOPMENT_WORKFLOW.md`.

---

# Escopo Fora da Sprint

Não faz parte desta sprint:

- migração para IA em nuvem;
- Tool Calling;
- memória de longo prazo;
- RAG;
- embeddings;
- busca semântica;
- otimizações prematuras;
- alterações arquiteturais sem necessidade comprovada.

---

# Entregáveis

Ao concluir a sprint deverão estar concluídos:

- integração funcional com o Ollama;
- utilização oficial do modelo `qwen3:4b-instruct`;
- validação do fluxo completo da IA;
- documentação revisada;
- criação do `DEVELOPMENT_WORKFLOW.md`;
- atualização do `PROJECT_STATE.md`;
- atualização do `PROJECT_HISTORY.md`;
- atualização do prompt padrão de abertura de sprint.

---

# Lições Incorporadas

Durante esta sprint deverão ser observados os seguintes princípios:

- arquitetura antes da implementação;
- documentação antes de inferências;
- uma alteração por vez;
- validar cada alteração antes da próxima;
- perguntar é melhor do que assumir;
- utilizar o Agente de Desenvolvimento apenas quando houver benefício claro;
- preservar a arquitetura existente.

---

# Observações

Sempre considerar o código-fonte como fonte da verdade.

Caso exista divergência entre documentação e implementação, registrar a divergência antes de prosseguir.

A IA utilizada pela plataforma e a IA utilizada durante o desenvolvimento possuem responsabilidades distintas.

O fluxo operacional oficial encontra-se em:

```
docs/DEVELOPMENT_WORKFLOW.md
```

A arquitetura deverá permanecer preparada para futura evolução da camada de IA sem impacto na lógica de negócio.