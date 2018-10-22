"use strict";

var _express = _interopRequireDefault(require("express"));

var _apolloServerExpress = require("apollo-server-express");

var _user = require("./user");

var _startsWith = _interopRequireDefault(require("lodash/startsWith"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const typeDefs = _apolloServerExpress.gql`
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
    user: _user.getUserByUsername,
    users: _user.getAllUser
  },
  Mutation: {
    register: _user.createUser,
    authenticate: _user.authenticateUser
  }
};
const app = (0, _express.default)();
const apollo = new _apolloServerExpress.ApolloServer({
  typeDefs,
  resolvers,
  path: "/graphql",
  tracing: true,
  context: async ({
    req,
    connection
  }) => {
    if (connection) {
      return {};
    } else {
      const authorizationHeader = req.headers.authorization || '';

      if ((0, _startsWith.default)(authorizationHeader, 'Bearer ')) {
        const token = authorizationHeader.substring(7);
        const user = (0, _user.validateUser)(token);
        console.log(user);
        if (user === null) throw new Error('Unauthorized');
        return {
          auth: {
            token,
            user
          }
        };
      }

      return {
        auth: undefined
      };
    }
  }
});
apollo.applyMiddleware({
  app
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));