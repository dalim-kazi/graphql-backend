import server from "./app";
import envConfig from "./config/env.config";

server.listen(envConfig.port).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
