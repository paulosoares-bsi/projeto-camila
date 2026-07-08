# NEXT_SPRINT
Este documento representa exclusivamente o objetivo da sprint atual.
Ao término da sprint ele deverá ser substituído pelo conteúdo da próxima sprint.

## Sprint

4.1

---

# Objetivo

Implementar a primeira versão funcional da camada de IA local do Projeto Camila.

Substituir o MockAIProvider pela integração com o Ollama utilizando o modelo qwen3:4b.

---

# Escopo

Esta sprint contempla apenas:

- integração com o Ollama;
- criação do AI Provider Local;
- primeira geração real de respostas pela IA;
- integração com a arquitetura existente;
- preparação da arquitetura para futura implementação de Tool Calling.

---

# Critérios de Aceite

Ao final da sprint deverá ser possível:

- enviar uma mensagem para o sistema;
- montar o contexto da conversa;
- construir o prompt;
- enviar o prompt ao Ollama;
- receber a resposta do modelo;
- devolver a resposta ao fluxo existente.

A arquitetura deve permanecer preparada para futura troca de modelo sem impacto significativo na lógica de negócio.

---

# Restrições

Não:

- alterar componentes estáveis sem necessidade;
- modificar a arquitetura existente;
- criar overengineering;
- criar dependência forte do Qwen;
- mover regras de negócio para o n8n.

Priorizar:

- simplicidade;
- baixo consumo de memória;
- baixo consumo de CPU;
- mínimo consumo de tokens;
- facilidade de manutenção.

---

# Impactos Esperados

Novos componentes esperados:

- LocalAIProvider (ou equivalente);
- integração com Ollama;
- abstração mínima para futura troca de modelo.

Componentes existentes devem sofrer o mínimo possível de alterações.

---

# Entregáveis

Ao concluir a sprint:

- código implementado;
- testes realizados;
- PROJECT_STATE.md atualizado;
- PROJECT_HISTORY.md atualizado;
- registro das decisões arquiteturais;
- registro das lições aprendidas.

---

# Observações

Sempre utilizar o código-fonte como fonte da verdade.

Caso sejam identificadas divergências entre documentação e implementação, registrar antes de prosseguir.

Evitar consumo desnecessário de tokens durante a implementação.