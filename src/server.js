import express from 'express';
import {ApolloServer, gql} from "apollo-server-express";
import {getAllUser, getUserByUsername, createUser, authenticateUser, validateUser} from "./user";
import startsWith from "lodash/startsWith";


const typeDefs = gql`
    type Query {
        user(username: String!): User
        users: [User]!
    }
    type Mutation {
        register(username: String!, email: String!, password: String!): User
        authenticate(username: String!, password: String!): String
    }
    type User {
        id: Int!
        username: String!
        email: String!
        createdAt: Int!
    }
`;
const resolvers = {
  Query: {
    user: getUserByUsername,
    users: getAllUser
  },
  Mutation: {
    register: createUser,
    authenticate: authenticateUser
  }
};

const app = express();

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  path: "/graphql",
  tracing: true,
  context: async ({req, connection}) => {
    if (connection) {
      return {};
    } else {
      const authorizationHeader = req.headers.authorization || '';
      if (startsWith(authorizationHeader, 'Bearer ')) {
        const token = authorizationHeader.substring(7);
        const user = validateUser(token);
        console.log(user);
        if (user === null) throw new Error('Unauthorized');
        return {auth: {token, user}};
      }
      return {auth: undefined};
    }
  }
});

apollo.applyMiddleware({app});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));