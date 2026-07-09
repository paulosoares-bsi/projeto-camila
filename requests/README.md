# Requests

Coleção de requisições HTTP utilizadas durante o desenvolvimento do Projeto Camila.

Os arquivos desta pasta são executados utilizando a extensão **REST Client** do Visual Studio Code.

## Organização

Cada arquivo representa um serviço da arquitetura.

```
api.http
evolution.http
hotmart.http
n8n.http
ollama.http
```

Cada requisição deve possuir um título utilizando:

```http
### Nome da operação
```

## Convenções

- Um arquivo por serviço.
- Utilizar variáveis para URLs e credenciais.
- Não armazenar credenciais reais.
- Agrupar endpoints relacionados.
- Utilizar exemplos simples e reutilizáveis.