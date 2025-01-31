import { User, UserRole } from "@prisma/client";
import { usersService } from "./user.service";
import { withAuth } from "../../middlewares/auth";
import { IPaginationOptions } from "../../interfaces/paginations";
import catchAsync from "../../../shared/catchAsync";

const userResolver = {
  Query: {
    users: catchAsync(
      async (_: unknown, args: IPaginationOptions, context: any) => {
        await withAuth([UserRole.ADMIN], context.token);
        return await usersService.getUsersIntoDB(args);
      }
    ),

    user: catchAsync(
      async (_: unknown, { id }: { id: string }, context: any) => {
        await withAuth([UserRole.ADMIN], context.token);
        return await usersService.getSingleUserIntoDB(id);
      }
    ),
  },

  Mutation: {
    createUser: catchAsync(async (_: unknown, user: User) => {
      return await usersService.crerateUser(user);
    }),

    updateUser: catchAsync(async (_: unknown, args: User, context: any) => {
      await withAuth([UserRole.ADMIN], context.token);
      return usersService.updateUserIntoDB(args);
    }),

    deleteUser: catchAsync(
      async (_: unknown, { id }: { id: string }, context: any) => {
        await withAuth([UserRole.ADMIN], context.token);
        return await usersService.deleteUserIntoDB(id, context.id);
      }
    ),
  },
};

export default userResolver;
