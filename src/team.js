import client from "./databaseclient";


export const getAllTeams = async (actualUser) => {
  const {rows: teams} = client.query(
    "SELECT * FROM teams;");

  return teams;
};

export const getTeamById = async (actualUser, teamId) => {
  const {rows: teams} = await client.query(
    "SELECT * FROM teams WHERE id = $1 LIMIT 1;",
    [teamId]);

  const team = teams[0];
  if (team !== undefined) return team;
  else return null;
};

export const getFollowedTeamsByUserId = async (actualUser, userId) => {
  const {rows: teams} = await client.query(
    "SELECT t.* FROM teams t INNER JOIN user_teams ut on t.id = ut.team_id WHERE ut.user_id = $1;",
    [userId]);

  return teams;
};

export const followTeam = async (actualUser, teamId) => {
  const {rows: teams} = await client.query(
    "SELECT * FROM teams WHERE id = $1 LIMIT 1;",
    [teamId]);

  const team = teams[0];
  if (team !== undefined) {
    const {rows: userteams} = await client.query(
      "SELECT 1 FROM user_teams WHERE user_id = $1 AND team_id = $2 LIMIT 1;",
      [actualUser.id, teamId]);

    if (userteams.length === 0) {
      await client.query(
        "INSERT INTO user_teams (user_id, team_id) VALUES ($1, $2);",
        [context.auth.user.id, teamId]);

      return team;
    } else return null;
  } else return null;
};

export const unfollowTeam = async (actualUser, teamId) => {
  const {rows: teams} = await client.query(
    "SELECT * FROM teams WHERE id = $1 LIMIT 1;",
    [teamId]);

  const team = teams[0];
  if (team !== undefined) {
    const {rows: userteams} = await client.query(
      "SELECT 1 FROM user_teams WHERE user_id = $1 AND team_id = $2 LIMIT 1;",
      [context.auth.user.id, teamId]);

    if (userteams.length === 1) {
      await client.query(
        "DELETE FROM user_teams WHERE user_id = $1 AND team_id = $2;",
        [context.auth.user.id, teamId]);

      return team;
    } else return null;
  } else return null;
};