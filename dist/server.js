"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_1 = require("./config/apollo");
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const apolloServer = (0, apollo_1.createApolloServer)();
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield apolloServer.start();
            apolloServer.applyMiddleware({ app: app });
            app.listen(4000, () => {
                console.log("Server is running on http://localhost:4000/graphql");
            });
        }
        catch (error) {
            console.error("Error during server startup:", error);
        }
    });
}
// Global error handling middleware
app.use(globalErrorHandler_1.default);
startServer();
