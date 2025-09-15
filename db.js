const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbFile = path.join(__dirname, 'cron.db');
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    name TEXT,
    url TEXT,
    method TEXT,
    interval_seconds INTEGER,
    cron_expr TEXT,
    headers TEXT,
    payload TEXT,
    enabled INTEGER DEFAULT 1,
    run_count INTEGER DEFAULT 0,
    last_run DATETIME
  )`);
});

module.exports = db;
