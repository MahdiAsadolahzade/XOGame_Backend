const { Pool } = require("pg");

const pool = new Pool({
  user: "root",
  password: "pmQhDiwsCiqMM5OoRO0dtLuA",
  host: "robin.iran.liara.ir",
  port: 32271, 
  database: "login_system"
});

module.exports = pool;
