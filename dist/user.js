"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateUser = exports.authenticateUser = exports.createUser = exports.getUserByUsername = exports.getAllUser = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _databaseclient = _interopRequireDefault(require("./databaseclient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const cert = 'shhhhhh';

const createHash = async data => {
  return await _bcrypt.default.hash(data, 20);
};

const compareHash = async (d1, d2) => {
  return await _bcrypt.default.compare(d1, d2);
};

const getAllUser = async (root, {}, context) => {
  const _ref = await _databaseclient.default.query('SELECT * FROM users;'),
        users = _ref.rows;

  return users.map(user => _objectSpread({}, user, {
    createdAt: Math.floor(user.createdAt / 1000)
  }));
};

exports.getAllUser = getAllUser;

const getUserByUsername = async (root, {
  username
}, context) => {
  const res = await _databaseclient.default.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = res.rows[0];
  if (user === undefined) return null;
  return _objectSpread({}, user, {
    createdAt: Math.floor(user.createdAt / 1000)
  });
};

exports.getUserByUsername = getUserByUsername;

const createUser = async (root, {
  username,
  email,
  password
}, context) => {
  const hasUser = (await _databaseclient.default.query('SELECT 1 FROM users WHERE username = $1 OR email = $2 LIMIT 1;', [username, email])).rows.length !== 0;

  if (!hasUser) {
    await _databaseclient.default.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, createHash(password)]);
    return getUserByUsername(root, {
      username
    }, context);
  } else {
    return null;
  }
};

exports.createUser = createUser;

const authenticateUser = async (root, {
  username,
  password
}, context) => {
  const res = await _databaseclient.default.query('SELECT id, username, email, password, "createdAt" FROM users WHERE username = $1 LIMIT 1;', [username]);
  if (res.rows.length === 0) return null;
  const user = res.rows[0];

  if (compareHash(user.password, password)) {
    return _jsonwebtoken.default.sign(user, cert);
  } else {
    return null;
  }
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