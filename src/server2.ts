import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

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
        return {
          ...user,
          todos: todos.filter(todo => todo.userId === user.id)
        }
      })
    },
    todos: () => todos,
    userById: (_: unknown, { id }: { id: string }) =>
      users.find((user) => user.id === id),
    todosByUser: (_: unknown, { userId }: { userId: string }) =>
      todos.filter((todo) => todo.userId === userId),
  },
  User: {
    todos: (parent: { id: string }) =>
      todos.filter((todo) => todo.userId === parent.id),
  },
  Todo: {
    user: (parent: { userId: string }) =>
      users.find((user) => user.id === parent.userId),
  },
};

// Server Setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  const { url } = await startStandaloneServer(server);
  console.log(`Server ready at ${url}`);
};

startServer();