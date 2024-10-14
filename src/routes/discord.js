const express = require("express");
const { getTotalMembers } = require("../discordBot");

const router = express.Router();

router.get("/members", (req, res) => {
  res.json({ success: true, totalMembers: getTotalMembers() });
});

module.exports = router;
