const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../config");

const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "No token provided" });
  }

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    req.userId = decoded.userId;
    next();
  });
};

router.get("/", verifyToken, (req, res) => {
  res.json({
    success: true,
    message: "This is a protected route",
    userId: req.userId,
  });
});

module.exports = router;
