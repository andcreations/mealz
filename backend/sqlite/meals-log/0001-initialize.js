async function up(db) {
  await db.run(`
    CREATE TABLE meal_logs (
      id TEXT PRIMARY KEY UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      meal_id TEXT NOT NULL,
      daily_plan_meal_name TEXT,
      logged_at INTEGER NOT NULL
    );
  `);
  await db.run(`
    CREATE UNIQUE INDEX meal_logs_user_id_logged_at ON meal_logs (user_id, logged_at);
  `);
}

async function down(db) {
  await db.run(`DROP INDEX IF EXISTS meal_logs_user_id_logged_at;`);
  await db.run(`DROP TABLE IF EXISTS meal_logs;`)
}

module.exports = { up, down };