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
const authors = [
    { id: "1", name: "Kate Chopin", age: 54 },
    { id: "2", name: "Paul Auster", age: 76 },
];
const publishers = [
    { id: "1", name: "Classic Books Inc.", location: "New York" },
    { id: "2", name: "Modern Reads", location: "London" },
];
const books = [
    {
        title: "The Awakening",
        author: "1",
        publisher: "1",
        genres: ["Fiction", "Drama"],
    },
    {
        title: "City of Glass",
        author: "2",
        publisher: "2",
        genres: ["Mystery", "Fiction"],
    },
];
const typeDefs = `#graphql
  type Author {
    id: ID!
    name: String!
    age: Int
    books: [Book]
  }

  type Publisher {
    id: ID!
    name: String!
    location: String
    books: [Book]
  }

  type Book {
    title: String!
    author: Author!
    publisher: Publisher!
    genres: [String]
  }

  type Query {
    books: [Book]
    authors: [Author]
    publishers: [Publisher]
    bookByTitle(title: String!): Book
    booksByGenre(genre: String!): [Book]
  }
`;
const resolvers = {
    Query: {
        books: () => books.map((book) => (Object.assign(Object.assign({}, book), { author: authors.find((author) => author.id === book.author), publisher: publishers.find((publisher) => publisher.id === book.publisher) }))),
        authors: () => authors.map((author) => (Object.assign(Object.assign({}, author), { books: books.filter((book) => book.author === author.id).map((book) => (Object.assign(Object.assign({}, book), { publisher: publishers.find((publisher) => publisher.id === book.publisher) }))) }))),
        publishers: () => publishers.map((publisher) => (Object.assign(Object.assign({}, publisher), { books: books.filter((book) => book.publisher === publisher.id).map((book) => (Object.assign(Object.assign({}, book), { author: authors.find((author) => author.id === book.author) }))) }))),
        bookByTitle: (_, { title }) => books
            .map((book) => (Object.assign(Object.assign({}, book), { author: authors.find((author) => author.id === book.author), publisher: publishers.find((publisher) => publisher.id === book.publisher) })))
            .find((book) => book.title === title),
        booksByGenre: (_, { genre }) => books
            .filter((book) => book.genres.includes(genre))
            .map((book) => (Object.assign(Object.assign({}, book), { author: authors.find((author) => author.id === book.author), publisher: publishers.find((publisher) => publisher.id === book.publisher) }))),
    },
};
const server = new server_1.ApolloServer({
    typeDefs,
    resolvers,
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = yield (0, standalone_1.startStandaloneServer)(server);
    console.log(`Server ready at ${url}`);
});
startServer();
