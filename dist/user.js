"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateUser = exports.authenticateUser = exports.createUser = exports.getUserById = exports.getUserByUsername = exports.getAllUsers = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _databaseclient = _interopRequireDefault(require("./databaseclient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const cert = "shhhhhh";

const createHash = async data => {
  return await _bcrypt.default.hash(data, 20);
};

const compareHash = async (d1, d2) => {
  return await _bcrypt.default.compare(d1, d2);
};

const getAllUsers = async actualUser => {
  const _ref = await _databaseclient.default.query("SELECT * FROM users;"),
        users = _ref.rows;

  return users.map(user => _objectSpread({}, user, {
    createdAt: Math.floor(user.created_at / 1000)
  }));
};

exports.getAllUsers = getAllUsers;

const getUserByUsername = async (actualUser, username) => {
  const _ref2 = await _databaseclient.default.query("SELECT * FROM users WHERE username = $1 LIMIT 1;", [username]),
        users = _ref2.rows;

  const user = users[0];
  if (user !== undefined) return _objectSpread({}, user, {
    createdAt: Math.floor(user.created_at / 1000)
  });else return null;
};

exports.getUserByUsername = getUserByUsername;

const getUserById = async (actualUser, userId) => {
  const _ref3 = await _databaseclient.default.query("SELECT * FROM users WHERE id = $1 LIMIT 1;", [userId]),
        users = _ref3.rows;

  const user = users[0];
  if (user !== undefined) return _objectSpread({}, user, {
    createdAt: Math.floor(user.created_at / 1000)
  });else return null;
};

exports.getUserById = getUserById;

const createUser = async (actualUser, username, email, password) => {
  const _ref4 = await _databaseclient.default.query("SELECT 1 FROM users WHERE username = $1 OR email = $2 LIMIT 1;", [username, email]),
        users = _ref4.rows;

  if (users.length === 0) {
    await _databaseclient.default.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3);", [username, email, createHash(password)]);
    return getUserByUsername(root, {
      username
    }, context);
  } else return null;
};

exports.createUser = createUser;

const authenticateUser = async (actualUser, username, password) => {
  const _ref5 = await _databaseclient.default.query("SELECT * FROM users WHERE username = $1 LIMIT 1;", [username]),
        users = _ref5.rows;

  const user = users[0];
  if (user === undefined) return null;
  if (compareHash(user.password, password)) return {
    token: _jsonwebtoken.default.sign(user, cert),
    user
  };else return null;
};

exports.authenticateUser = authenticateUser;

const validateUser = token => {
  try {
    return _jsonwebtoken.default.verify(token, cert);
  } catch (e) {
    return null;
  }
};

exports.validateUser = validateUser;