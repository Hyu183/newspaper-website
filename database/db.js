const dotenv = require("dotenv");

dotenv.config();

const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DP_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
  pool: { min: 0, max: 7 },
});

module.exports = knex;
