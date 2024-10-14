const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db } = require("../database");
const config = require("../config");
const logger = require("../logger");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    logger.warn("Registration attempt with missing username or password");
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required" });
  }

  try {
    db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async (err, row) => {
        if (err) {
          logger.error("Error checking username", { error: err.message });
          return res
            .status(500)
            .json({ success: false, message: "Error checking username" });
        }
        if (row) {
          logger.warn("Registration attempt with existing username", {
            username,
          });
          return res
            .status(400)
            .json({ success: false, message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
          "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
          [username, hashedPassword, "user"],
          (err) => {
            if (err) {
              logger.error("Error registering user", { error: err.message });
              return res
                .status(500)
                .json({ success: false, message: "Error registering user" });
            }
            logger.info("User registered successfully", { username });
            res
              .status(201)
              .json({ success: true, message: "User registered successfully" });
          }
        );
      }
    );
  } catch (error) {
    logger.error("Server error during registration", { error: error.message });
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required" });
  }

  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) {
        logger.error("Error during login", { error: err.message });
        return res
          .status(500)
          .json({ success: false, message: "Error during login" });
      }
      if (!user) {
        logger.warn("Login attempt with non-existent username", { username });
        return res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        logger.warn("Login attempt with incorrect password", { username });
        return res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        config.JWT_SECRET,
        { expiresIn: "60m" }
      );

      logger.info("User logged in successfully", { username });
      res.json({ success: true, token });
    }
  );
});

module.exports = router;
