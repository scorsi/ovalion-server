"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pg = require("pg");

const client = new _pg.Pool();
client.connect();
var _default = client;
exports.default = _default;