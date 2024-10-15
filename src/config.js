require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex"),
  DB_FILE: process.env.DB_FILE || "./users.db",
  VIOLATIONS_DB_PATH:
    process.env.VIOLATIONS_DB_PATH || "/home/vovanhau/toxic/users.db",
  DISCORD_TOKEN:
    process.env.DISCORD_TOKEN ||,
  USERS_DB_PATH:
    process.env.USERS_DB_PATH || "/home/vovanhau/disscord/users.db",
};
