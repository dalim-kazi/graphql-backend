import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../interfaces/paginations";
import catchAsync from "../../../shared/catchAsync";

const crerateUser = async (payload: User) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new ApiError(409, "Email already exist!");
  }
  const hashedPassword = await bcrypt.hash(payload.password as string, 10);

  const newUser = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
  });

  const { password, ...sanitizedUser } = newUser;

  return sanitizedUser;
};

const getSingleUserIntoDB = async (id: string) => {
  return catchAsync(async () => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiError(404, "user not found!");
    }

    const { password, ...sanitizedUser } = user;
    return {
      user: sanitizedUser,
      message: "User retrieved successfully.",
      success: true,
    };
  });
};

const getUsersIntoDB = async (args: IPaginationOptions) => {
  return catchAsync(async () => {
    let { limit, searchQuery, page } = args;

    // Ensure numbers
    limit = Number(limit) || 10;
    page = Number(page) || 1;
    const skip = (page - 1) * limit;

    let filter: any = {};

    if (searchQuery) {
      filter = {
        OR: [
          { name: { contains: searchQuery, mode: "insensitive" } },
          { email: { contains: searchQuery, mode: "insensitive" } },
        ],
      };
    }

    const users = await prisma.user.findMany({
      where: filter,
      skip,
      take: limit,
    });

    if (users.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, "Users not found!");
    }

    const sanitizedUsers = users.map(({ password, ...user }) => ({
      ...user,
    }));

    const totalUsers = await prisma.user.count({ where: filter });
    const totalPages = Math.ceil(totalUsers / limit);

    return {
      meta: { totalPages, limit, totalItems: totalUsers, currentPage: page },
      users: sanitizedUsers,
      message: "Users retrieved successfully.",
      success: true,
    };
  });
};

const updateUserIntoDB = async (arg: User) => {
  return catchAsync(async () => {
    const { id, ...userData } = arg;
    const existingUser = await getSingleUserIntoDB(id);
    if (!existingUser) {
      throw new ApiError(404, "user not found for edit user");
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
    });

    const { password, ...sanitizedUser } = updatedUser;

    return {
      user: sanitizedUser,
      message: "User updated successfully.",
      success: true,
    };
  });
};

const deleteUserIntoDB = async (userId: string, loggedId: string) => {
  if (userId === loggedId) {
    throw new ApiError(403, "You can't delete your own account!");
  }
  const existingUser = await getSingleUserIntoDB(userId);
  if (!existingUser) {
    throw new ApiError(404, "user not found for delete this");
  }
  await prisma.user.delete({
    where: { id: userId },
  });
  return {
    message: "User deleted successfully.",
    success: true,
  };
};

export const usersService = {
  crerateUser,
  getSingleUserIntoDB,
  getUsersIntoDB,
  updateUserIntoDB,
  deleteUserIntoDB,
};
