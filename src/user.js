import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import client from "./databaseclient";


const cert = "shhhhhh";

const createHash = async (data) => {
  return await bcrypt.hash(data, 20);
};

const compareHash = async (d1, d2) => {
  return await bcrypt.compare(d1, d2);
};

export const getAllUsers = async (actualUser) => {
  const {rows: users} = await client.query(
    "SELECT * FROM users;");

  return users.map((user) => ({
    ...user,
    createdAt: Math.floor(user.created_at / 1000)
  }));
};

export const getUserByUsername = async (actualUser, username) => {
  const {rows: users} = await client.query(
    "SELECT * FROM users WHERE username = $1 LIMIT 1;",
    [username]);

  const user = users[0];
  if (user !== undefined) return {
    ...user,
    createdAt: Math.floor(user.created_at / 1000)
  };
  else return null;
};

export const getUserById = async (actualUser, userId) => {
  const {rows: users} = await client.query(
    "SELECT * FROM users WHERE id = $1 LIMIT 1;",
    [userId]);

  const user = users[0];
  if (user !== undefined) return {
    ...user,
    createdAt: Math.floor(user.created_at / 1000)
  };
  else return null;
};

export const createUser = async (actualUser, username, email, password) => {
  const {rows: users} = await client.query(
    "SELECT 1 FROM users WHERE username = $1 OR email = $2 LIMIT 1;",
    [username, email]);

  if (users.length === 0) {
    await client.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3);",
      [username, email, createHash(password)]);
    return getUserByUsername(root, {username}, context);
  } else return null;
};

export const authenticateUser = async (actualUser, username, password) => {
  const {rows: users} = await client.query(
    "SELECT * FROM users WHERE username = $1 LIMIT 1;",
    [username]);

  const user = users[0];
  if (user === undefined) return null;
  if (compareHash(user.password, password)) return {token: jwt.sign(user, cert), user};
  else return null;
};

export const validateUser = (token) => {
  try {
    return jwt.verify(token, cert);
  } catch (e) {
    return null;
  }
};