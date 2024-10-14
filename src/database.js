const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const config = require("./config");
const logger = require("./logger");

const dbExists = fs.existsSync(config.DB_FILE);

const db = new sqlite3.Database(config.DB_FILE, (err) => {
  if (err) {
    logger.error("Error opening database", { error: err.message });
  } else {
    logger.info("Connected to the SQLite database.");

    if (!dbExists) {
      logger.info("Creating new database and users table.");
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
      )`,
        (err) => {
          if (err) {
            logger.error("Error creating users table", { error: err.message });
          } else {
            logger.info("Users table created successfully.");
          }
        }
      );
    }
  }
});

const violationsDb = new sqlite3.Database(config.VIOLATIONS_DB_PATH, (err) => {
  if (err) {
    logger.error("Error opening violations database", { error: err.message });
  } else {
    logger.info("Connected to the violations SQLite database.");
  }
});

module.exports = { db, violationsDb };
