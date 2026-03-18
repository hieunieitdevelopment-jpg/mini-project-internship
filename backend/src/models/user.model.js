const { client } = require("../config/db");

// tim user bang email
exports.findByEmail = async (email) => {
  const sql = "SELECT * FROM users WHERE email = $1";
  const result = await client.query(sql, [email]);
  return result.rows[0] || null;
};

// tim user bang username
exports.findByUsername = async (username) => {
  const sql = "SELECT * FROM users WHERE username = $1";
  const result = await client.query(sql, [username]);
  return result.rows[0] || null;
};

// tao user moi, tra ve user (khong tra password)
exports.createUser = async ({ username, email, hashedPassword, fullName, phone }) => {
  const sql = `
    INSERT INTO users (username, email, password, full_name, phone)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, username, email, full_name, phone, role, created_at
  `;
  const values = [username, email, hashedPassword, fullName, phone || null];
  const result = await client.query(sql, values);
  return result.rows[0];
};
