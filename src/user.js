import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import client from './databaseclient';

const cert = 'shhhhhh';

const createHash = async (data) => {
  return await bcrypt.hash(data, 20);
};

const compareHash = async (d1, d2) => {
  return await bcrypt.compare(d1, d2);
};

const getAllUser = async (root, {}, context) => {
  const {rows: users} = await client.query('SELECT * FROM users;');
  return users.map((user) => ({
    ...user,
    createdAt: Math.floor(user.createdAt / 1000)
  }));
};

const getUserByUsername = async (root, {username}, context) => {
  const res = await client.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = res.rows[0];
  if (user === undefined) return null;
  return {
    ...user,
    createdAt: Math.floor(user.createdAt / 1000)
  };
};

const createUser = async (root, {username, email, password}, context) => {
  const hasUser = (await client.query('SELECT 1 FROM users WHERE username = $1 OR email = $2 LIMIT 1;', [username, email])).rows.length !== 0;
  if (!hasUser) {
    await client.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, createHash(password)]);
    return getUserByUsername(root, {username}, context);
  } else {
    return null;
  }
};

const authenticateUser = async (root, {username, password}, context) => {
  const res = await client.query('SELECT id, username, email, password, "createdAt" FROM users WHERE username = $1 LIMIT 1;', [username]);
  if (res.rows.length === 0) return null;
  const user = res.rows[0];
  if (compareHash(user.password, password)) {
    return jwt.sign(user, cert);
  } else {
    return null;
  }
};

const validateUser = (token) => {
  try {
    return jwt.verify(token, cert);
  } catch (e) {
    return null;
  }
};

export {getAllUser, getUserByUsername, createUser, authenticateUser, validateUser};