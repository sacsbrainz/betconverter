import Database from "bun:sqlite";

const dbPath = Bun.env.APP_ANALYTIC_DB_FILE_PATH || "storage/analytics.db"
const db: Database = new Database(dbPath, {
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
