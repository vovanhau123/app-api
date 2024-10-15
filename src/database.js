const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const config = require("./config");
const console = require("./console");

const dbExists = fs.existsSync(config.DB_FILE);

const db = new sqlite3.Database(config.DB_FILE, (err) => {
  if (err) {
    console.error("Error opening database", { error: err.message });
  } else {
    console.info("Connected to the SQLite database.");

    if (!dbExists) {
      console.info("Creating new database and users table.");
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
      )`,
        (err) => {
          if (err) {
            console.error("Error creating users table", { error: err.message });
          } else {
            console.info("Users table created successfully.");
          }
        }
      );
    }
  }
});

const violationsDb = new sqlite3.Database(config.VIOLATIONS_DB_PATH, (err) => {
  if (err) {
    console.error("Error opening violations database", { error: err.message });
  } else {
    console.info("Connected to the violations SQLite database.");
  }
});

module.exports = { db, violationsDb };
