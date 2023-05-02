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

## How to contribute to the project

If you want to contribute to this project, be it fixing bugs, adding new features or improving the documentation, you can follow these steps:

1. Fork this repository at <https://github.com/siqueira-gustavo/node-mongodb-simples-crud>
1. Create a branch with the name of your feature or fix (for example, feature/new-feature or fix/bug-fixed).
1. Make the necessary changes to the code and tests.
1. Commit and push your changes to your branch.
1. Open a pull request to the original repository's master branch.
1. Wait for your pull request to be reviewed and respond to comments if necessary.
1. If your pull request is accepted, it will be merged into the original repository's master branch.

Thanks for your collaboration!
