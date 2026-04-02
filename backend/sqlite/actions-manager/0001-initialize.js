async function up(db) {
  await db.run(`
    CREATE TABLE actions (
      id TEXT PRIMARY KEY UNIQUE NOT NULL,
      domain TEXT NOT NULL,
      service TEXT NOT NULL,
      topic TEXT NOT NULL,
      payload BLOB NOT NULL,
      status TEXT NOT NULL,
      error TEXT,
      created_at INTEGER NOT NULL,
      executed_at INTEGER
    );
  `);
}

async function down(db) {
  await db.run(`DROP TABLE IF EXISTS actions;`)
}

module.exports = { up, down };