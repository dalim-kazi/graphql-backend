import { User } from "@prisma/client";
import { authService } from "./auth.service";

const authResolver = {
  Mutation: {
    login: async (_: unknown, user: User) => {
      return await authService.loginUserIntoDB(user);
    },
  },
};

export default authResolver;
