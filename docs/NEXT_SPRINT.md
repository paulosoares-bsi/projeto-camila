# NEXT_SPRINT

Este documento representa exclusivamente o objetivo da sprint atual.

Ao término da sprint ele deverá ser substituído pelo conteúdo da próxima sprint.

## Sprint

4.2

---

# Objetivo

Consolidar a utilização do Ollama na plataforma, atualizar o modelo oficial para `qwen3:4b-instruct` e preparar a arquitetura para a próxima evolução da camada de IA.

Esta sprint também consolida o novo fluxo oficial de desenvolvimento entre ChatGPT e o Agente de Desenvolvimento.

---

# Escopo

Esta sprint contempla apenas:

- atualizar toda a plataforma para utilizar `qwen3:4b-instruct`;
- validar o comportamento do novo modelo;
- revisar o OllamaProvider;
- revisar prompts e parâmetros do modelo;
- validar a compatibilidade da arquitetura existente;
- manter a arquitetura preparada para futura implementação de Tool Calling;
- revisar a documentação da camada de IA.

---

# Critérios de Aceite

Ao final da sprint deverá ser possível:

- enviar uma mensagem para o sistema;
- montar corretamente o contexto da conversa;
- construir o prompt;
- enviar o prompt ao Ollama;
- utilizar oficialmente o modelo `qwen3:4b-instruct`;
- receber respostas do novo modelo;
- devolver a resposta ao fluxo existente;
- manter a possibilidade de troca futura do modelo sem alterações na regra de negócio.

---

# Restrições

Não:

- alterar componentes estáveis sem necessidade;
- modificar a arquitetura existente;
- criar overengineering;
- criar dependência forte do modelo utilizado;
- mover regras de negócio para o n8n;
- utilizar modelos locais como agente de desenvolvimento.

Priorizar:

- simplicidade;
- baixo consumo de recursos;
- facilidade de manutenção;
- desacoplamento;
- estabilidade da arquitetura.

---

# Fluxo Oficial da Sprint

Toda implementação deverá seguir obrigatoriamente o fluxo abaixo:

1. ChatGPT realiza auditoria do projeto.
2. ChatGPT pesquisa documentação oficial quando necessário.
3. ChatGPT define arquitetura e estratégia.
4. ChatGPT produz um prompt objetivo para o Agente de Desenvolvimento.
5. Agente de Desenvolvimento implementa o escopo aprovado.
6. Agente executa testes.
7. Agente realiza operações de Git quando solicitado.
8. ChatGPT realiza auditoria final.
9. Documentação atualizada.

---

# Escopo Fora da Sprint

Não faz parte desta sprint:

- migração para IA em nuvem da plataforma;
- Tool Calling;
- memória de longo prazo;
- RAG;
- embeddings;
- busca semântica;
- otimizações prematuras;
- substituição do agente de desenvolvimento.

---

# Entregáveis

Ao concluir a sprint:

- plataforma utilizando oficialmente `qwen3:4b-instruct`;
- testes executados;
- validação do novo modelo;
- documentação atualizada;
- PROJECT_STATE.md atualizado;
- PROJECT_HISTORY.md atualizado;
- decisões arquiteturais registradas;
- lições aprendidas registradas.

---

# Lições Incorporadas

Durante esta sprint deverão ser observados os seguintes princípios:

- arquitetura é definida antes da implementação;
- decisões devem ser baseadas em documentação oficial e experiências consolidadas;
- benchmarks próprios somente após análise técnica prévia;
- evitar experimentos que apresentem baixa probabilidade de sucesso para o hardware disponível;
- otimizar o trabalho do Agente de Desenvolvimento utilizando prompts objetivos e escopo reduzido.

---

# Observações

Sempre utilizar o código-fonte como fonte da verdade.

Caso sejam identificadas divergências entre documentação e implementação, registrar antes de prosseguir.

O n8n poderá permanecer desativado enquanto não fizer parte do escopo desta sprint.

A IA utilizada pela plataforma e a IA utilizada durante o desenvolvimento possuem responsabilidades distintas e não devem ser confundidas.

A arquitetura deverá permanecer preparada para futura substituição do modelo de IA sem impacto na lógica de negócio.