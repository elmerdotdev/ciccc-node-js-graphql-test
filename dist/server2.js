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
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
// Sample Data
const users = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
];
const todos = [
    { id: "1", userId: "1", title: "Buy groceries", completed: false },
    { id: "2", userId: "1", title: "Read a book", completed: true },
    { id: "3", userId: "2", title: "Work out", completed: false },
];
// GraphQL Schema
const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    todos: [Todo]
  }

  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
    user: User!
  }

  type Query {
    users: [User]
    todos: [Todo]
    userById(id: ID!): User
    todosByUser(userId: ID!): [Todo]
  }
`;
// Resolvers
const resolvers = {
    Query: {
        users: () => {
            return users.map(user => {
                return Object.assign(Object.assign({}, user), { todos: todos.filter(todo => todo.userId === user.id) });
            });
        },
        todos: () => todos,
        userById: (_, { id }) => users.find((user) => user.id === id),
        todosByUser: (_, { userId }) => todos.filter((todo) => todo.userId === userId),
    },
    User: {
        todos: (parent) => todos.filter((todo) => todo.userId === parent.id),
    },
    Todo: {
        user: (parent) => users.find((user) => user.id === parent.userId),
    },
};
// Server Setup
const server = new server_1.ApolloServer({
    typeDefs,
    resolvers,
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = yield (0, standalone_1.startStandaloneServer)(server);
    console.log(`Server ready at ${url}`);
});
startServer();
