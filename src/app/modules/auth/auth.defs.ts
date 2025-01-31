import { gql } from "apollo-server-express";

const authTypeDef = gql`
  type User {
    id: String!
    name: String!
    email: String!
    role: String!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type Mutation {
    login(name: String!, email: String!, password: String!): User
  }
`;
export default authTypeDef;
