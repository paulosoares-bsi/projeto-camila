# PROJECT_PHILOSOPHY

> Este documento define a filosofia oficial de desenvolvimento do Projeto Camila.
>
> Diferentemente do `PROJECT_STATE.md`, que descreve o estado atual do projeto, este documento contém princípios permanentes que devem orientar qualquer IA ou desenvolvedor que trabalhe no repositório.

---

# Objetivo

Garantir que todas as decisões técnicas sejam consistentes ao longo da vida do projeto.

Este documento deve permanecer relativamente estável entre as sprints.

---

# Filosofia Geral

O Projeto Camila prioriza:

- simplicidade;
- baixo acoplamento;
- alta coesão;
- arquitetura evolutiva;
- facilidade de manutenção;
- estabilidade;
- decisões baseadas em evidências.

Evitar soluções complexas para problemas simples.

---

# Responsabilidades

## ChatGPT

Responsável por:

- auditoria do projeto;
- pesquisa técnica;
- pesquisa de documentação oficial;
- pesquisa de benchmarks;
- pesquisa de experiências consolidadas da comunidade;
- arquitetura;
- planejamento das sprints;
- revisão crítica das implementações;
- identificação de riscos;
- atualização da documentação.

O ChatGPT deve atuar como arquiteto técnico do projeto.

---

## Agente de Desenvolvimento

Responsável por:

- implementar alterações;
- executar refatorações delimitadas;
- corrigir bugs;
- executar testes;
- realizar operações de Git quando solicitado.

O agente não deve alterar arquitetura nem tomar decisões de negócio por iniciativa própria.

---

# Fluxo Oficial

Toda sprint deverá seguir o fluxo abaixo.

```
Auditoria

↓

Arquitetura

↓

Pesquisa

↓

Planejamento

↓

Prompt

↓

Agente de Desenvolvimento

↓

Implementação

↓

Testes

↓

Git

↓

Auditoria Final

↓

Documentação
```

Não inverter esta ordem.

---

# Processo de Tomada de Decisão

Antes de adotar qualquer tecnologia nova, seguir obrigatoriamente esta sequência:

1. Documentação oficial.
2. Benchmarks independentes.
3. Experiências consolidadas da comunidade.
4. Compatibilidade com o hardware disponível.
5. Benchmark próprio.
6. Decisão arquitetural.

Evitar experimentação quando houver forte evidência de baixa probabilidade de sucesso.

---

# Critérios para Recomendações

As sugestões devem ser:

- conservadoras;
- fundamentadas;
- reproduzíveis;
- compatíveis com a realidade do projeto.

Evitar recomendações apenas porque são tecnologias recentes ou populares.

Sempre que possível citar limitações conhecidas.

---

# Filosofia de Arquitetura

A arquitetura deve permitir:

- troca de providers;
- troca de modelos de IA;
- evolução incremental;
- baixo impacto entre componentes.

Toda regra de negócio pertence ao Core.

Toda integração externa deve ocorrer através de Providers.

---

# Filosofia de IA

Existem duas inteligências distintas.

## IA da Plataforma

Responsável pelo atendimento ao cliente.

Atualmente:

- Ollama;
- qwen3:4b-instruct.

Esta IA deve ser substituível futuramente sem alterar a lógica de negócio.

---

## IA de Desenvolvimento

Responsável pela implementação do software.

Nesta fase do projeto utiliza:

- ChatGPT para arquitetura e auditoria;
- Agente de Desenvolvimento para implementação.

Modelos locais não são utilizados como agente principal de desenvolvimento nesta fase.

---

# Economia de Recursos

O projeto deve minimizar:

- consumo de tokens;
- consumo de CPU;
- consumo de RAM;
- tempo de execução;
- número de chamadas ao modelo;
- contexto enviado aos modelos.

Economia de recursos deve ser considerada juntamente com produtividade.

Uma solução mais barata que aumente significativamente o tempo de desenvolvimento não deve ser adotada.

---

# Filosofia de Implementação

Implementar apenas o necessário para a sprint.

Evitar:

- overengineering;
- abstrações prematuras;
- otimizações prematuras;
- funcionalidades sem demanda.

---

# Filosofia de Documentação

A documentação deve refletir apenas decisões consolidadas.

Evitar registrar hipóteses ou experimentos que não façam parte da arquitetura oficial.

Cada documento deve possuir responsabilidade clara.

Evitar duplicação de conteúdo.

---

# Filosofia de Git

Uma sprint somente é considerada concluída quando:

- implementação concluída;
- testes executados;
- documentação atualizada;
- alterações versionadas.

---

# Lições Permanentes

As seguintes lições passam a fazer parte da cultura do projeto.

## Benchmark antes da implementação

Antes de investir tempo significativo em uma tecnologia, validar sua viabilidade através de documentação, benchmarks e experiências da comunidade.

---

## Arquitetura antes do código

Toda implementação deve partir de uma arquitetura previamente definida.

---

## Simplicidade

A solução mais simples que atenda corretamente ao requisito deve ser preferida.

---

## Separação de responsabilidades

A IA da plataforma e a IA utilizada durante o desenvolvimento possuem objetivos diferentes e devem evoluir de forma independente.

---

## Código como fonte da verdade

Sempre que existir divergência entre documentação e implementação, o código deve ser analisado primeiro.

A documentação deverá ser atualizada quando necessário.

---

# Revisão

Este documento deve sofrer poucas alterações ao longo do projeto.

Novos princípios somente deverão ser adicionados quando representarem decisões permanentes da arquitetura ou da forma de desenvolvimento.