"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@graphql-tools/schema");
const resolvers_1 = __importDefault(require("./resolvers"));
const type_defs_1 = __importDefault(require("./type.defs"));
const schema = (0, schema_1.makeExecutableSchema)({
    typeDefs: type_defs_1.default,
    resolvers: resolvers_1.default,
});
exports.default = schema;
