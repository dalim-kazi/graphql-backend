import app from "./app";
import envConfig from "./config/env.config";

// Start the server
app.listen(envConfig.port, () => {
  console.log(`🚀 Server ready at http://localhost:${envConfig.port}/graphql`);
});
