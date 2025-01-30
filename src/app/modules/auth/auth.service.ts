import envConfig from "../../../config/env.config";
import ApiError from "../../../errors/ApiErrors";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";

//login user
const loginUserIntoDB = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    user?.password as string
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = jwtHelpers.generateToken(
    user,
    envConfig.jwt.jwt_secret as string,
    envConfig.jwt.expires_in as string
  );
  const { password, status, createdAt, updatedAt, ...userInfo } = user;

  return {
    accessToken,
    userInfo,
  };
};

export const authService = {
  loginUserIntoDB,
};
