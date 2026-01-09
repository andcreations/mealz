async function up(db) {
  await db.run(`
    CREATE TABLE hydration_logs (
      id TEXT PRIMARY KEY UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      glass_fraction TEXT NOT NULL,
      logged_at INTEGER NOT NULL
    );
  `);
  await db.run(`
    CREATE INDEX hydration_logs_user_id ON hydration_logs (user_id);
  `);
}

async function down(db) {
  await db.run(`DROP INDEX IF EXISTS hydration_logs_user_id;`);
  await db.run(`DROP TABLE IF EXISTS hydration_logs;`)
}

module.exports = { up, down };