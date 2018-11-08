import client from './databaseclient';


export const getAllMatches = async (actualUser) => {
  const {rows: matches} = await client.query(
    "SELECT * FROM matches;");

  return matches.map((match) => ({
    ...match,
    date: Math.floor(match.date / 1000)
  }));
};

export const getMatchById = async (actualUser, matchId) => {
  const {rows: matches} = await client.query(
    "SELECT * FROM matches WHERE id = $1 LIMIT 1;",
    [matchId]);

  const match = matches[0];
  if (match !== undefined) return {
    ...match,
    date: Math.floor(match.date / 1000)
  };
  else return null;
};