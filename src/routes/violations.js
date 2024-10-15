const express = require("express");
const { violationsDb } = require("../database");
// const console = require("../console");

const router = express.Router();

router.get("/", (req, res) => {
  const sql = "SELECT * FROM violations";
  violationsDb.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching violations", { error: err.message });
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

module.exports = router;
