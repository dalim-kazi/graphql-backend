import { Secret } from "jsonwebtoken";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiErrors";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import envConfig from "../../config/env.config";
import { User, UserRole } from "@prisma/client";
import prisma from "../../shared/prisma";

export const withAuth = async (roles: UserRole[], token: string) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }
  // Verify the JWT token
  const verifiedUser = jwtHelpers.verifyToken(
    token,
    envConfig.jwt.jwt_secret as Secret
  );
  const existingUser = await prisma.user.findUnique({
    where: { email: verifiedUser.email },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Check if the user role is authorized to access the resource
  if (roles.length && !roles.includes(verifiedUser.role)) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Forbidden! You are not authorized."
    );
  }

  return verifiedUser as User;
};
