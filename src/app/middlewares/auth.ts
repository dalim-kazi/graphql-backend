import { Secret } from "jsonwebtoken";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiErrors";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import envConfig from "../../config/env.config";
import { User, UserRole } from "@prisma/client";

export const withAuth = async (roles: UserRole[], token: string) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }
  // Verify the JWT token
  const verifiedUser = jwtHelpers.verifyToken(
    token,
    envConfig.jwt.jwt_secret as Secret
  );

  // Check if the user role is authorized to access the resource
  if (roles.length && !roles.includes(verifiedUser.role)) {
    console.log("Unauthorized role:", verifiedUser.role);
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Forbidden! You are not authorized."
    );
  }

  return verifiedUser as User;
};
