"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unfollowTeam = exports.followTeam = exports.getFollowedTeamsByUserId = exports.getTeamById = exports.getAllTeams = void 0;

var _databaseclient = _interopRequireDefault(require("./databaseclient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getAllTeams = async actualUser => {
  const _client$query = _databaseclient.default.query("SELECT * FROM teams;"),
        teams = _client$query.rows;

  return teams;
};

exports.getAllTeams = getAllTeams;

const getTeamById = async (actualUser, teamId) => {
  const _ref = await _databaseclient.default.query("SELECT * FROM teams WHERE id = $1 LIMIT 1;", [teamId]),
        teams = _ref.rows;

  const team = teams[0];
  if (team !== undefined) return team;else return null;
};

exports.getTeamById = getTeamById;

const getFollowedTeamsByUserId = async (actualUser, userId) => {
  const _ref2 = await _databaseclient.default.query("SELECT t.* FROM teams t INNER JOIN user_teams ut on t.id = ut.team_id WHERE ut.user_id = $1;", [userId]),
        teams = _ref2.rows;

  return teams;
};

exports.getFollowedTeamsByUserId = getFollowedTeamsByUserId;

const followTeam = async (actualUser, teamId) => {
  const _ref3 = await _databaseclient.default.query("SELECT * FROM teams WHERE id = $1 LIMIT 1;", [teamId]),
        teams = _ref3.rows;

  const team = teams[0];

  if (team !== undefined) {
    const _ref4 = await _databaseclient.default.query("SELECT 1 FROM user_teams WHERE user_id = $1 AND team_id = $2 LIMIT 1;", [actualUser.id, teamId]),
          userteams = _ref4.rows;

    if (userteams.length === 0) {
      await _databaseclient.default.query("INSERT INTO user_teams (user_id, team_id) VALUES ($1, $2);", [context.auth.user.id, teamId]);
      return team;
    } else return null;
  } else return null;
};

exports.followTeam = followTeam;

const unfollowTeam = async (actualUser, teamId) => {
  const _ref5 = await _databaseclient.default.query("SELECT * FROM teams WHERE id = $1 LIMIT 1;", [teamId]),
        teams = _ref5.rows;

  const team = teams[0];

  if (team !== undefined) {
    const _ref6 = await _databaseclient.default.query("SELECT 1 FROM user_teams WHERE user_id = $1 AND team_id = $2 LIMIT 1;", [context.auth.user.id, teamId]),
          userteams = _ref6.rows;

    if (userteams.length === 1) {
      await _databaseclient.default.query("DELETE FROM user_teams WHERE user_id = $1 AND team_id = $2;", [context.auth.user.id, teamId]);
      return team;
    } else return null;
  } else return null;
};

exports.unfollowTeam = unfollowTeam;