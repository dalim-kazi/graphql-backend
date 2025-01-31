import { User, UserRole } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { usersService } from "./user.service";
import { withAuth } from "../../middlewares/auth";
import { IPaginationOptions } from "../../interfaces/paginations";

const userResolver = {
  Query: {
    users: async (_: unknown, args: IPaginationOptions) => {
      return await usersService.getUsersIntoDB(args);
    },

    user: async (_: unknown, { id }: { id: string }) => {
      return await usersService.getSingleUserIntoDB(id);
    },
  },
  Mutation: {
    createUser: async (_: unknown, user: User, context: any) => {
      await withAuth([UserRole.ADMIN], context.auth);
      return await usersService.crerateUser(user);
    },

    updateUser: async (_: unknown, args: User, context: any) => {
      await withAuth([UserRole.ADMIN], context.auth);
      return usersService.updateUserIntoDB(args);
    },

    deleteUser: async (_: unknown, { id }: { id: string }, context: User) => {
      return await usersService.deleteUserIntoDB(id, context.id);
    },
  },
};

export default userResolver;
