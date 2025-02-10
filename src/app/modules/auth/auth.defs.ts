import { gql } from "apollo-server-express";

const authTypeDef = gql`
  type LoginResponse {
    message: String!
    success: Boolean!
    accessToken: String
    userInfo: User
  }

  type ForgotPasswordOtpResponse {
    message: String!
    success: Boolean!
    otp: String!
  }

  type VerifyOtpResponse {
    accessToken: String!
    message: String!
    success: Boolean!
  }

  type ResetPasswordResponse {
    message: String!
    success: Boolean!
  }

  type UpdateProfileResponse {
    message: String!
    success: Boolean!
    userInfo: User
  }

  type Query {
    getProfile(userId: ID!): User!
  }

  type Mutation {
    login(email: String!, password: String!): LoginResponse!
    loginWithSocialAuth(email: String!, name: String!): LoginResponse!
    sendForgotPasswordOtp(email: String!): ForgotPasswordOtpResponse!
    verifyForgotPasswordOtp(email: String!, otp: String!): VerifyOtpResponse!
    resetPassword(userId: ID!, newPassword: String!): ResetPasswordResponse!
    updateProfile(userId: ID!, userData: UserInput!): UpdateProfileResponse!
  }

  input UserInput {
    name: String
    email: String
    status: String
  }
`;

export default authTypeDef;
