async function up(db) {
  await db.run(`
    CREATE TABLE UserMeals (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      mealId TEXT NOT NULL,
      typeId TEXT NOT NULL
    );
  `);
  await db.run(`
    CREATE UNIQUE INDEX UserMeals_userId_typeId ON UserMeals (userId, typeId);
  `);
}

async function down(db) {
  await db.run(`DROP INDEX IF EXISTS UserMeals_userId_typeId;`);
  await db.run(`DROP TABLE IF EXISTS Meals;`)
}

module.exports = { up, down };