async function up(db) {
  await db.run(`
    CREATE TABLE MealLogs (
      id TEXT PRIMARY KEY UNIQUE NOT NULL,
      userId TEXT NOT NULL,
      mealId TEXT NOT NULL,
      dailyPlanMealName TEXT,
      loggedAt INTEGER NOT NULL
    );
  `);
  await db.run(`
    CREATE UNIQUE INDEX MealLogs_userId_loggedAt ON MealLogs (userId, loggedAt);
  `);
}

async function down(db) {
  await db.run(`DROP INDEX IF EXISTS MealLogs_userId_loggedAt;`);
  await db.run(`DROP TABLE IF EXISTS MealLogs;`)
}

module.exports = { up, down };