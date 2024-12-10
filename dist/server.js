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
const customers = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
];
const products = [
    { id: "1", name: "Laptop", price: 1200 },
    { id: "2", name: "Smartphone", price: 800 },
];
const orders = [
    { id: "1", customerId: "1", productIds: ["1", "2"], total: 2000 },
    { id: "2", customerId: "2", productIds: ["2"], total: 800 },
];
// GraphQL Schema
const typeDefs = `#graphql
  type Customer {
    id: ID!
    name: String!
    email: String!
    orders: [Order]
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
  }

  type Order {
    id: ID!
    customer: Customer!
    products: [Product]!
    total: Float!
  }

  type Query {
    customers: [Customer]
    products: [Product]
    orders: [Order]
    customerById(id: ID!): Customer
    ordersByCustomer(customerId: ID!): [Order]
  }
`;
// Resolvers
const resolvers = {
    Query: {
        customers: () => customers,
        products: () => products,
        orders: () => orders.map((order) => (Object.assign(Object.assign({}, order), { customer: customers.find((customer) => customer.id === order.customerId), products: order.productIds.map((productId) => products.find((product) => product.id === productId)) }))),
        customerById: (_, { id }) => customers.find((customer) => customer.id === id),
        ordersByCustomer: (_, { customerId }) => orders
            .filter((order) => order.customerId === customerId)
            .map((order) => (Object.assign(Object.assign({}, order), { customer: customers.find((customer) => customer.id === order.customerId), products: order.productIds.map((productId) => products.find((product) => product.id === productId)) }))),
    },
    Customer: {
        orders: (parent) => orders
            .filter((order) => order.customerId === parent.id)
            .map((order) => (Object.assign(Object.assign({}, order), { products: order.productIds.map((productId) => products.find((product) => product.id === productId)) }))),
    },
    Order: {
        customer: (parent) => customers.find((customer) => customer.id === parent.customerId),
        products: (parent) => parent.productIds.map((productId) => products.find((product) => product.id === productId)),
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
