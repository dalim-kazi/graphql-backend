import { gql } from "apollo-server-express";

const userTypeDef = gql`
  type User {
    id: String!
    name: String!
    email: String!
    role: String!
    status: String!
    createdAt: String!
    updatedAt: String!
  }
  type Meta {
    limit: Int!
    searchQuery: String!
    totalPages: Int!
    totalItems: Int!
    currentPage: Int!
  }

  type SingleUser {
    message: String!
    success: Boolean!
    user: User!
  }

  type GetUsers {
    message: String!
    success: Boolean!
    meta: Meta!
    users: [User!]!
  }
  type UpsatedUser {
    message: String!
    success: Boolean!
    user: User!
  }

  type deleteUser {
    message: String!
    success: Boolean!
  }

  input UserFilter {
    role: String
    status: String
  }

  type Query {
    users(
      page: Int!
      limit: Int!
      searchQuery: String
      filter: UserFilter
      sortBy: String
      order: String
    ): GetUsers
    user(id: String!): SingleUser
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User
    updateUser(id: String!, name: String): UpsatedUser
    deleteUser(id: String!): deleteUser
  }
`;
export default userTypeDef;
