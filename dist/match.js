"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMatchById = exports.getAllMatches = void 0;

var _databaseclient = _interopRequireDefault(require("./databaseclient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const getAllMatches = async actualUser => {
  const _ref = await _databaseclient.default.query("SELECT * FROM matches;"),
        matches = _ref.rows;

  return matches.map(match => _objectSpread({}, match, {
    date: Math.floor(match.date / 1000)
  }));
};

exports.getAllMatches = getAllMatches;

const getMatchById = async (actualUser, matchId) => {
  const _ref2 = await _databaseclient.default.query("SELECT * FROM matches WHERE id = $1 LIMIT 1;", [matchId]),
        matches = _ref2.rows;

  const match = matches[0];
  if (match !== undefined) return _objectSpread({}, match, {
    date: Math.floor(match.date / 1000)
  });else return null;
};

exports.getMatchById = getMatchById;