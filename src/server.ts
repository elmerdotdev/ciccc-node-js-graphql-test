import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone'

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const typeDefs = `#graphql
  type Book {
    title: String,
    author: String
  }

  type Query {
    hello: String,
    hey: String,
    books: [Book]
  }
`

const resolvers = {
  Query: {
    hello: () => "world",
    hey: () => "yo!",
    books: () => books
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

const startServer = async () => {
  const { url } = await startStandaloneServer(server)
  console.log(`Server ready at ${url}`)
}

startServer()