import express from "express";
import { ApolloServer } from "apollo-server-express";
import schema from "./graphql/schema";
const app = express();

const server = new ApolloServer({
  schema,
  context: ({ req }) => ({
    token: req.headers.authorization || "",
  }),
});

const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app: app as any, path: "/graphql" });
};

startServer();

export default app;
