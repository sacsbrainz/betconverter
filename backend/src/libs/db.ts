import Database from "bun:sqlite";

const db: Database = new Database("storage/analytics.db", {
  strict: true,
  create: true,
});

const configurePragmas = `
PRAGMA main.synchronous = NORMAL;
PRAGMA main.journal_mode = WAL;
PRAGMA main.auto_vacuum = INCREMENTAL;
`;

const createTableStm = `
CREATE TABLE IF NOT EXISTS {table} (
    id INTEGER PRIMARY KEY, 
    data TEXT,
    response_time DECIMAL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

try {
  db.exec(configurePragmas);
  const stmt = createTableStm.replace(/{table}/g, "analytics");
  db.exec(stmt);
} catch (err) {
  console.error(err);
}
export default db;
