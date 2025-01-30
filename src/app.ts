import { ApolloServer } from "apollo-server";
import graphqlErrorHandler from "./app/middlewares/graphqlErrorHandler";
import typeDefs from "./graphql/type.defs";
import resolvers from "./graphql/resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    const formattedError = graphqlErrorHandler(error);
    return {
      message: formattedError.message,
      extensions: formattedError.extensions,
    };
  },
  context: ({ req }) => ({
    auth: req.headers.authorization || "",
  }),
  formatResponse: (response: any) => {
    if (response.errors && response.errors.length > 0) {
      const error = response?.errors?.[0];
      return {
        ...response,
        errors: {
          message: error.message,
          extensions: error.extensions,
        },
      };
    }
    return response;
  },
});

export default server;
