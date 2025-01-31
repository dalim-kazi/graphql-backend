import { User } from "@prisma/client";
import { authService } from "./auth.service";
import catchAsync from "../../../shared/catchAsync";

const authResolver = {
  Mutation: {
    login: catchAsync(async (_: unknown, user: User) => {
      return await authService.loginUserIntoDB(user);
    }),

    loginWithSocialAuth: catchAsync(async (_: unknown, user: User) => {
      return await authService.loginUserWithSocialAuth(user);
    }),

    sendForgotPasswordOtp: catchAsync(
      async (_: unknown, { email }: { email: string }) => {
        return await authService.sendForgotPasswordOtpDB(email);
      }
    ),

    verifyForgotPasswordOtp: catchAsync(async (_: unknown, payload: any) => {
      return await authService.verifyForgotPasswordOtpCodeDB(payload);
    }),

    resetPassword: catchAsync(
      async (
        _: unknown,
        { newPassword, userId }: { newPassword: string; userId: string }
      ) => {
        return await authService.resetForgotPasswordDB(newPassword, userId);
      }
    ),

    updateProfile: catchAsync(
      async (
        _: unknown,
        { userId, userData }: { userId: string; userData: any }
      ) => {
        return await authService.updateProfileIntoDB(userId, userData);
      }
    ),
  },

  Query: {
    getProfile: catchAsync(
      async (_: unknown, { userId }: { userId: string }) => {
        return await authService.getProfileFromDB(userId);
      }
    ),
  },
};

export default authResolver;
