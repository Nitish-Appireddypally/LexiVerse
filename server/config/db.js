const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool
  .connect()
  .then(() => {
    console.log("✅ Connected to PostgreSQL (Neon)");
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
  });

module.exports = pool;
