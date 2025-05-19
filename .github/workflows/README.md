# CI/CD Workflow para CashFlow Frontend

Este workflow automatiza o processo de build, teste e deploy da aplicação CashFlow Frontend para o DockerHub.

## O que o workflow faz

1. É acionado em pushes para a branch `main` e pull requests direcionadas à `main`
2. Configura o ambiente Node.js e instala as dependências
3. Executa os testes
4. Faz login no DockerHub
5. Constrói a imagem Docker usando o Dockerfile
6. Publica a imagem no DockerHub com as tags:
   - `latest` - sempre a versão mais recente
   - `sha-xxxxx` - tag baseada no hash do commit

## Configuração necessária

Para que o workflow funcione corretamente, você precisa configurar os seguintes segredos no seu repositório GitHub:

1. Vá para `Settings > Secrets and variables > Actions`
2. Adicione os seguintes segredos:
   - `DOCKERHUB_USERNAME`: Seu nome de usuário do DockerHub
   - `DOCKERHUB_TOKEN`: Um token de acesso pessoal do DockerHub (não use sua senha)

### Como criar um token no DockerHub

1. Faça login no [DockerHub](https://hub.docker.com/)
2. Clique no seu nome de usuário > Account Settings > Security
3. Em "Access Tokens", clique em "New Access Token"
4. Dê um nome ao token (ex: "GitHub Actions")
5. Selecione pelo menos as permissões "Read & Write"
6. Copie o token gerado (ele só será mostrado uma vez)

## Notas sobre segurança

- Os tokens são utilizados apenas durante a execução do workflow
- Em pull requests de repositórios forks, o workflow será executado, mas não fará push para o DockerHub
- Evite expor os tokens em logs ou em qualquer parte do código

## Fluxo de implantação

```
GitHub Repository (Push) --> GitHub Actions --> Testes --> Build Docker --> DockerHub
```

## Personalização

Você pode personalizar o workflow editando o arquivo `.github/workflows/docker-publish.yml`. 