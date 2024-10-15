const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { client, isReady } = require("../discordBot"); // Sử dụng client và biến isReady
const config = require("../config");

const router = express.Router();

// Connect to the new database
const usersDb = new sqlite3.Database(config.USERS_DB_PATH, (err) => {
  if (err) {
    console.error("Error opening users database", { error: err.message });
  } else {
    console.info("Connected to the users SQLite database.");
  }
});

router.get("/click", async (req, res) => {
  // Kiểm tra trạng thái của bot
  if (!isReady) {
    return res.status(503).json({ message: "Chờ chút nhé, đang sắp xếp dữ liệu" });
  }

  const sql = "SELECT id, username, click_count, role_status FROM users";
  usersDb.all(sql, [], async (err, rows) => {
    if (err) {
      console.error("Error fetching users", { error: err.message });
      return res.status(400).json({ error: err.message });
    }

    const usersWithExtendedInfo = await Promise.all(
      rows.map(async (user) => {
        if (!user.id || user.id === "null") {
          return {
            id: user.id || null,
            username: user.username,
            click_count: user.click_count,
            role_status: user.role_status,
            avatar_url: null,
          };
        }

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
          console.error(
            `Error fetching avatar for user ${user.id}:`,
            error.message
          );
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
