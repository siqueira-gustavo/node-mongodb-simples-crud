# Node MongoDB Simple CRUD

This is a simple Node.js project that demonstrates how to perform CRUD (create, read, update, delete) operations on a MongoDB database.

## Requirements

To run this project, you need to have Node.js and MongoDB installed on your machine. You also need to create a `.env` file in the root directory of the project, with the following variables:

- PORT: the port number for the server to listen on
- MONGO_USERNAME: the username string for the MongoDB database
- MONGO_PASSWORD: the password string for the MongoDB database
- HELPER_SECRET: the data to update the Hmac content

## Installation

To install the dependencies, run:

`npm install`

## Usage

To start the server, run:

`npm start`

The server will listen on the port specified in the .env file. You can use a tool like Postman or curl to send requests to the server.

The server exposes the following endpoints:

- GET /users: get all users from the database
- POST /users: create a new user in the database
- GET /users/:id: get a user by id from the database
- PUT /users/:id: update a user by id in the database
- DELETE /users/:id: delete a user by id from the database

The user model has the following schema:

```json
{
  "name": String,
  "email": String,
  "age": Number
}
```

## Como contribuir para o projeto

Se você quiser contribuir para este projeto, seja corrigindo bugs, adicionando novas funcionalidades ou melhorando a documentação, você pode seguir os seguintes passos:

1. Faça um fork deste repositório em <https://github.com/siqueira-gustavo/node-mongodb-simples-crud>
1. Crie uma branch com o nome da sua funcionalidade ou correção (por exemplo, feature/nova-funcionalidade ou fix/bug-corrigido).
1. Faça as alterações necessárias no código e nos testes.
1. Faça um commit e push das suas alterações para a sua branch.
1. Abra um pull request para a branch master do repositório original.
1. Aguarde a revisão do seu pull request e responda aos comentários se necessário.
1. Se o seu pull request for aceito, ele será mesclado na branch master do repositório original.

Obrigado pela sua colaboração!
