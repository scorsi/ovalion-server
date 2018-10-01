"use strict";

var _express = _interopRequireDefault(require("express"));

var _apolloServerExpress = require("apollo-server-express");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    type Query {\n        hello: String\n    }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var typeDefs = (0, _apolloServerExpress.gql)(_templateObject());
var resolvers = {
  Query: {
    hello: function hello() {
      return "world";
    }
  }
};
var app = (0, _express.default)();
var apollo = new _apolloServerExpress.ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  path: "/graphql"
});
apollo.applyMiddleware({
  app: app
});
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  return console.log("Example app listening on port ".concat(PORT, "!"));
});