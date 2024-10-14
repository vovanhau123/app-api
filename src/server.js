const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config");
const logger = require("./logger");
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
const discordRoutes = require("./routes/discord");
const violationsRoutes = require("./routes/violations");
const usersRoutes = require("./routes/users");

const app = express();

app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/discord", discordRoutes);
app.use("/violations", violationsRoutes);
app.use("/users", usersRoutes);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
