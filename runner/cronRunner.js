const axios = require("axios");
const db = require("../db");

let timers = [];

function runJob(job) {
  try {
    const headers = job.headers ? JSON.parse(job.headers) : {};
    const payload = job.payload ? JSON.parse(job.payload) : {};

    if (job.method === "GET") {
      axios.get(job.url, { headers });
    } else {
      axios.post(job.url, payload, { headers });
    }

    db.run(
      `UPDATE jobs SET run_count = run_count + 1, last_run = datetime('now') WHERE id = ?`,
      [job.id]
    );

    console.log(`[OK] ${job.name} (${job.url})`);
  } catch (err) {
    console.error(`[ERR] ${job.name}: ${err.message}`);
  }
}

function loadJobs(callback) {
  db.all("SELECT * FROM jobs WHERE enabled = 1", [], (err, rows) => {
    if (err) return console.error(err);
    callback(rows);
  });
}

function start() {
  timers.forEach(t => clearInterval(t));
  timers = [];

  loadJobs(rows => {
    rows.forEach(job => {
      const t = setInterval(() => runJob(job), job.interval_seconds * 1000);
      timers.push(t);
      console.log(`Cron added: ${job.name} (${job.interval_seconds}s)`);
    });
  });

  setTimeout(start, 60000);
}

module.exports = { start };
