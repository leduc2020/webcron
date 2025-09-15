const express = require("express");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  db.all("SELECT * FROM jobs", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post("/", (req, res) => {
  const { name, url, method, interval_seconds } = req.body;
  const id = uuidv4();

  db.run(
    `INSERT INTO jobs (id, name, url, method, interval_seconds, enabled) 
     VALUES (?, ?, ?, ?, ?, 1)`,
    [id, name, url, method, interval_seconds],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Job added", id });
    }
  );
});

router.put("/:id", (req, res) => {
  const { name, url, method, interval_seconds, enabled } = req.body;

  db.run(
    `UPDATE jobs SET 
      name = COALESCE(?, name),
      url = COALESCE(?, url),
      method = COALESCE(?, method),
      interval_seconds = COALESCE(?, interval_seconds),
      enabled = COALESCE(?, enabled)
     WHERE id = ?`,
    [name, url, method, interval_seconds, enabled, req.params.id],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Job updated" });
    }
  );
});

router.delete("/:id", (req, res) => {
  db.run("DELETE FROM jobs WHERE id = ?", [req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Job deleted" });
  });
});

module.exports = router;
