const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./test/localdb');

db.run(`CREATE TABLE IF NOT EXISTS users (
  id integer NOT NULL PRIMARY KEY,
  username text NOT NULL UNIQUE,
  email text
)`);
db.close();