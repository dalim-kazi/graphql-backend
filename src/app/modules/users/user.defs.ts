import { gql } from "apollo-server-express";

const userTypeDef = gql`
  type User {
    id: String!
    name: String!
    email: String!
    password: String!
    role: String!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    users: [User]
    user(id: String!): User
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User
    updateUser(id: String!, name: String, email: String): User
    deleteUser(id: String!): Boolean
  }
`;
export default userTypeDef;
