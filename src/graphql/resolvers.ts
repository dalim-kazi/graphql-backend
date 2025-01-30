import authResolver from "../app/modules/auth/auth.resolver";
import userResolver from "../app/modules/users/user.resolver";

const resolvers = [userResolver, authResolver];
export default resolvers;
