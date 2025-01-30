import { User, UserRole } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { usersService } from "./user.service";
import { withAuth } from "../../middlewares/auth";
const userResolver = {
  Query: {
    users: async () => await prisma.user.findMany(),
    user: async (_: unknown, { id }: { id: string }) =>
      await prisma.user.findUnique({ where: { id } }),
  },
  Mutation: {
    createUser: async (_: unknown, user: User, context: any) => {
      await withAuth([UserRole.ADMIN], context.auth);
      return await usersService.crerateUser(user);
    },

    updateUser: async (
      _: any,
      { id, name, email }: { id: string; name?: string; email?: string }
    ) => {
      return await prisma.user.update({
        where: { id },
        data: { name, email },
      });
    },
    deleteUser: async (_: unknown, { id }: { id: string }) => {
      await prisma.user.delete({ where: { id } });
      return true;
    },
  },
};

export default userResolver;
