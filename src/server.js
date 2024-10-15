const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config");
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
const discordRoutes = require("./routes/discord");
const violationsRoutes = require("./routes/violations");
const usersRoutes = require("./routes/users");
const { readyPromise } = require("./discordBot");

const app = express();

app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/discord", discordRoutes);
app.use("/violations", violationsRoutes);
app.use("/users", usersRoutes);

// Đợi Discord bot sẵn sàng trước khi khởi động server
readyPromise
  .then(() => {
    app.listen(config.PORT, () => {
      console.info(`Server running on port ${config.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize Discord bot:", error);
    process.exit(1);
  });
