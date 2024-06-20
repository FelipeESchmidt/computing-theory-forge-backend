# Projeto: Gerenciador de Máquinas Teóricas

Este projeto é uma aplicação para gerenciar máquinas teóricas, especificamente voltada para estudantes e entusiastas de máquinas universais, permitindo a criação, programação, execução e salvamento dessas máquinas.

## Índice

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Dependências](#dependências)
- [Rotas da API](#rotas-da-api)
- [Middlewares](#middlewares)
- [Testes](#testes)
- [Licença](#licença)

## Instalação

Para começar, clone o repositório e instale as dependências:

```bash
git clone https://github.com/FelipeESchmidt/computing-theory-forge-backend.git
cd computing-theory-forge-backend
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

```env
NODE_ENV=development
HOST=localhost
PORT=3000
CORS_ORIGIN=http://localhost:3000
COMMON_RATE_LIMIT_MAX_REQUESTS=1000
COMMON_RATE_LIMIT_WINDOW_MS=1000
JWT_SECRET=seuSegredoJWT
DB_HOST=localhost
DB_PORT=5432
DB_USER=seuUsuarioDB
DB_PASS=suaSenhaDB
DB_NAME=nomeDoSeuDB
ENCRYPTION_KEY=suaChaveDeCriptografia
```

## Estrutura do Projeto

O projeto segue uma estrutura organizada para manter o código limpo e fácil de entender:

```bash
src/
  api/
  api-docs/
  common/
    crypto/
    middlewares/
    models/
    token/
    utils/
  database/
  index.ts
```

## Dependências

As principais dependências do projeto incluem:

- Node.js
- TypeScript
- Express
- dotenv
- envalid
- bcrypt
- jsonwebtoken
- pino-http
- express-rate-limit
- helmet
- body-parser
- swagger-ui-express

## Rotas da API

### Autenticação

#### Registro de Usuário

- **Rota**: `/auth/register`
- **Método**: `POST`
- **Descrição**: Registra um novo usuário.
- **Campos**: `nome`, `email`, `senha`, `confirmacaoSenha`
- **Resposta**: `201 Created` ou erro de campo obrigatório/conflito.

#### Login de Usuário

- **Rota**: `/auth/login`
- **Método**: `POST`
- **Descrição**: Realiza o login do usuário.
- **Campos**: `email`, `senha`
- **Resposta**: `200 OK` com token JWT ou erro de autenticação.

#### Atualização de Usuário

- **Rota**: `/auth/update`
- **Método**: `PUT`
- **Descrição**: Atualiza os dados do usuário logado.
- **Campos**: `nome`, `senhaAntiga`, `novaSenha`, `confirmacaoNovaSenha`
- **Resposta**: `200 OK` ou erro de validação.

### Máquinas Teóricas

#### Criação de Máquina

- **Rota**: `/machines`
- **Método**: `POST`
- **Descrição**: Cria uma nova máquina teórica.
- **Campos**: `nome`, `estruturaDaMaquina`
- **Resposta**: `201 Created` com ID da máquina.

#### Atualização de Máquina

- **Rota**: `/machines/:id`
- **Método**: `PUT`
- **Descrição**: Atualiza uma máquina existente.
- **Campos**: `nome`, `estruturaDaMaquina`
- **Resposta**: `200 OK` ou erro de validação.

#### Remoção de Máquina

- **Rota**: `/machines/:id`
- **Método**: `DELETE`
- **Descrição**: Remove uma máquina existente.
- **Resposta**: `200 OK` ou erro de validação.

#### Busca de Máquinas

- **Rota**: `/machines`
- **Método**: `GET`
- **Descrição**: Busca todas as máquinas do usuário logado.
- **Resposta**: `200 OK` com lista de máquinas.

## Middlewares

### Autenticação

Valida se a requisição possui um token JWT válido, garantindo o acesso a rotas privadas.

### Segurança

Utiliza `helmet` para proteger os headers HTTP e `express-rate-limit` para limitar a taxa de requisições e prevenir ataques DoS.

### Logging

Utiliza `pino-http` para registrar detalhes das requisições e respostas HTTP.

### Body Parser

Utiliza `body-parser` para analisar e processar o corpo das requisições HTTP, facilitando o acesso aos dados enviados pelos clientes.

## Testes

Para garantir a integridade do código, foram implementados testes automatizados utilizando `vitest` e `supertest`. Esses testes validam os serviços e rotas da aplicação.

### Execução dos Testes

```bash
yarn test:dev
```

Os testes são integrados com a ferramenta `Husky`, garantindo que eles sejam executados antes de cada commit ou push, mantendo a qualidade do código.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

Esperamos que esta aplicação seja útil para estudantes e entusiastas da teoria da computação, proporcionando uma plataforma prática e acessível para o estudo de máquinas teóricas.
