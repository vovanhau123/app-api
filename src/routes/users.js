const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { Client, GatewayIntentBits } = require("discord.js");
const config = require("../config");
const logger = require("../logger");

const router = express.Router();
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// Connect to the new database
const usersDb = new sqlite3.Database(config.USERS_DB_PATH, (err) => {
  if (err) {
    logger.error("Error opening users database", { error: err.message });
  } else {
    logger.info("Connected to the users SQLite database.");
  }
});

router.get("/click", async (req, res) => {
  const sql = "SELECT id, username, click_count, role_status FROM users";
  usersDb.all(sql, [], async (err, rows) => {
    if (err) {
      logger.error("Error fetching users", { error: err.message });
      return res.status(400).json({ error: err.message });
    }

    const usersWithExtendedInfo = await Promise.all(
      rows.map(async (user) => {
        try {
          const discordUser = await client.users.fetch(user.id);
          return {
            id: user.id,
            username: user.username,
            click_count: user.click_count,
            role_status: user.role_status,
            avatar_url: discordUser.displayAvatarURL({
              format: "png",
              dynamic: true,
              size: 1024,
            }),
          };
        } catch (error) {
          logger.error(`Error fetching avatar for user ${user.id}:`, error.message);
          return {
            id: user.id,
            username: user.username,
            click_count: user.click_count,
            role_status: user.role_status,
            avatar_url: null,
            avatar_error: error.message,
          };
        }
      })
    );

    res.json(usersWithExtendedInfo);
  });
});

module.exports = router;
