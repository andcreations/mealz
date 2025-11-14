async function up(db) {
  await db.run(`
    CREATE TABLE MealDailyPlans (
      id TEXT PRIMARY KEY UNIQUE NOT NULL,
      userId TEXT NOT NULL,
      detailsVersion INTEGER NOT NULL,
      details BLOB NOT NULL,
      createdAt INTEGER NOT NULL
    );
  `);
  await db.run(`
    CREATE INDEX MealDailyPlans_userId ON MealDailyPlans (userId);
  `);
}

async function down(db) {
  await db.run(`DROP INDEX IF EXISTS MealDailyPlans_userId;`);
  await db.run(`DROP TABLE IF EXISTS MealDailyPlans;`)
}

module.exports = { up, down };