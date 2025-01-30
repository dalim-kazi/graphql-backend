"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const userTypeDef = (0, apollo_server_express_1.gql) `
  type User {
    id: Int!
    name: String!
    email: String!
    createdAt: String!
  }

  type Query {
    users: [User]
    user(id: Int!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: Int!, name: String, email: String): User
    deleteUser(id: Int!): Boolean
  }
`;
exports.default = userTypeDef;
