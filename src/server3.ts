import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

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
    books: () =>
      books.map((book) => ({
        ...book,
        author: authors.find((author) => author.id === book.author),
        publisher: publishers.find((publisher) => publisher.id === book.publisher),
      })),
    authors: () =>
      authors.map((author) => ({
        ...author,
        books: books.filter((book) => book.author === author.id).map((book) => ({
          ...book,
          publisher: publishers.find((publisher) => publisher.id === book.publisher),
        })),
      })),
    publishers: () =>
      publishers.map((publisher) => ({
        ...publisher,
        books: books.filter((book) => book.publisher === publisher.id).map((book) => ({
          ...book,
          author: authors.find((author) => author.id === book.author),
        })),
      })),
    bookByTitle: (_: unknown, { title }: { title: string }) =>
      books
        .map((book) => ({
          ...book,
          author: authors.find((author) => author.id === book.author),
          publisher: publishers.find((publisher) => publisher.id === book.publisher),
        }))
        .find((book) => book.title === title),
    booksByGenre: (_: unknown, { genre }: { genre: string }) =>
      books
        .filter((book) => book.genres.includes(genre))
        .map((book) => ({
          ...book,
          author: authors.find((author) => author.id === book.author),
          publisher: publishers.find((publisher) => publisher.id === book.publisher),
        })),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  const { url } = await startStandaloneServer(server);
  console.log(`Server ready at ${url}`);
};

startServer();