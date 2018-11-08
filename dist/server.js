"use strict";

var _express = _interopRequireDefault(require("express"));

var _apolloServerExpress = require("apollo-server-express");

var _startsWith = _interopRequireDefault(require("lodash/startsWith"));

var user = _interopRequireWildcard(require("./user"));

var match = _interopRequireWildcard(require("./match"));

var team = _interopRequireWildcard(require("./team"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const typeDefs = _apolloServerExpress.gql`
    type Query {
        actualUser: User
        userByUsername(username: String!): User
        userById(id: Int!): User
        users: [User!]!
        teamById(id: Int!): Team
        teams: [Team!]!
        followedTeamsByUserId(id: Int!): [Team!]!
        matchById(id: Int!): Match
        matches: [Match!]!
    }
    type Mutation {
        register(username: String!, email: String!, password: String!): User
        authenticate(username: String!, password: String!): AuthenticatePayload
        followTeam(id: Int!): Team
        unfollowTeam(id: Int!): Team
    }

    type AuthenticatePayload {
        user: User!
        token: String!
    }
    type User {
        id: Int!
        username: String!
        email: String!
        matches: [Match!]!
        createdAt: Int!
    }
    type Team {
        id: Int!
        name: String!
        location: String!
    }
    type Match {
        id: Int!
        homeTeam: Team!
        outsideTeam: Team!
        homeTeamScore: Int
        outsideTeamScore: Int
        date: Int!
    }
`;
const resolvers = {
  Query: {
    userByUsername: async (root, params, context) => await user.getUserByUsername(context.auth.user, params.username),
    userById: async (root, params, context) => await user.getUserById(context.auth.user, params.id),
    users: async (root, params, context) => await user.getAllUsers(context.auth.user),
    teamById: async (root, params, context) => await team.getTeamById(context.auth.user, params.id),
    teams: async (root, params, context) => await team.getAllTeams(context.auth.user),
    followedTeamsByUserId: async (root, params, context) => await team.getFollowedTeamsByUserId(context.auth.user, params.id),
    matchById: async (root, params, context) => await match.getMatchById(context.auth.user, params.id),
    matches: async (root, params, context) => await match.getAllMatches(context.auth.user)
  },
  Mutation: {
    register: async (root, params, context) => await user.createUser(context.auth.user, params.username, params.email, params.password),
    authenticate: async (root, params, context) => await user.authenticateUser(context.auth.user, params.username, params.password),
    followTeam: async (root, params, context) => await team.followTeam(context.auth.user, params.id),
    unfollowTeam: async (root, params, context) => await team.unfollowTeam(context.auth.user, params.id)
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
      return {
        auth: {
          token: undefined,
          user: undefined
        }
      };
    } else {
      const authorizationHeader = req.headers.authorization || '';

      if ((0, _startsWith.default)(authorizationHeader, "Bearer ")) {
        const token = authorizationHeader.substring(7);
        const u = user.validateUser(token);
        if (u === null) throw new Error("Unauthorized");
        return {
          auth: {
            token,
            user: u
          }
        };
      }

      return {
        auth: {
          token: undefined,
          user: undefined
        }
      };
    }
  }
});
apollo.applyMiddleware({
  app
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));