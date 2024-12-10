import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

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
    orders: () =>
      orders.map((order) => ({
        ...order,
        customer: customers.find((customer) => customer.id === order.customerId),
        products: order.productIds.map((productId) =>
          products.find((product) => product.id === productId)
        ),
      })),
    customerById: (_: unknown, { id }: { id: string }) =>
      customers.find((customer) => customer.id === id),
    ordersByCustomer: (_: unknown, { customerId }: { customerId: string }) =>
      orders
        .filter((order) => order.customerId === customerId)
        .map((order) => ({
          ...order,
          customer: customers.find((customer) => customer.id === order.customerId),
          products: order.productIds.map((productId) =>
            products.find((product) => product.id === productId)
          ),
        })),
  },
  Customer: {
    orders: (parent: { id: string }) =>
      orders
        .filter((order) => order.customerId === parent.id)
        .map((order) => ({
          ...order,
          products: order.productIds.map((productId) =>
            products.find((product) => product.id === productId)
          ),
        })),
  },
  Order: {
    customer: (parent: { customerId: string }) =>
      customers.find((customer) => customer.id === parent.customerId),
    products: (parent: { productIds: string[] }) =>
      parent.productIds.map((productId) =>
        products.find((product) => product.id === productId)
      ),
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