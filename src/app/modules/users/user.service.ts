import { User } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";

const crerateUser = async (user: User) => {
  const exsisringUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (exsisringUser) {
    throw new ApiError(400, "User already exists");
  }
  return await prisma.user.create({
    data: user,
  });
};

export const usersService = {
  crerateUser,
};
