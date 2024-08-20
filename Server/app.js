const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { connectDB } = require('./config/db');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    let user = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = decoded;
      } catch (err) {
        console.error('Token verification failed:', err);
      }
    }

    const db = await connectDB(); 
    return { user, db };
  },
});

async function startServer() {
  try {
    await server.start();
    server.applyMiddleware({ app });

    app.listen({ port }, () =>
      console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
    );
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();
