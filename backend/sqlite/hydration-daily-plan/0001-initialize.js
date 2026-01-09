async function up(db) {
  await db.run(`
    CREATE TABLE hydration_daily_plans (
      id TEXT PRIMARY KEY UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      details_version INTEGER NOT NULL,
      details BLOB NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
  await db.run(`
    CREATE INDEX hydration_daily_plans_user_id ON hydration_daily_plans (user_id);
  `);
}

async function down(db) {
  await db.run(`DROP INDEX IF EXISTS hydration_daily_plans_user_id;`);
  await db.run(`DROP TABLE IF EXISTS hydration_daily_plans;`)
}

module.exports = { up, down };