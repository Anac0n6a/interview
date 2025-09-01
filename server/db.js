const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.resolve(__dirname, 'todos.db');
const db = new Database(DB_FILE);

// run migrations if needed
const migration = fs.readFileSync(path.resolve(__dirname, 'migrations.sql'), 'utf8');
db.exec(migration);

module.exports = {
  all: (sql, params=[]) => db.prepare(sql).all(params),
  get: (sql, params=[]) => db.prepare(sql).get(params),
  run: (sql, params=[]) => db.prepare(sql).run(params)
};
