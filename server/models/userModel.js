const pool = require("../config/db");

// const createUser = async (name, email, password, role) => {
//   const result = await db.query(
//     "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
//     [name, email, password, role]
//   );
//   return result.rows[0];
// };

const createUser = async ({name, email, password, role}) => {
  const query = `INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING *;`;
    const values = [name, email, password, role];
  const result = await pool.query(query, values);
  return result.rows[0];
}

const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

module.exports = {
  // createUser,
  getUserByEmail,
  createUser
};
