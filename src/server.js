import express from 'express';
import {ApolloServer, gql} from "apollo-server-express";


const typeDefs = gql`
    type Query {
        hello: String
    }
`;
const resolvers = {
  Query: {
    hello: () => "world"
  }
};

const app = express();

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  path: "/graphql"
});

apollo.applyMiddleware({ app });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));