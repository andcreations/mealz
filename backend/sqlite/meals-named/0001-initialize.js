async function up(db) {
  await db.run(`
    CREATE TABLE named_meals (
      id TEXT PRIMARY KEY UNIQUE NOT NULL,
      user_id TEXT,
      meal_name TEXT NOT NULL,
      meal_id TEXT NOT NULL
    );
  `);
  await db.run(`
    CREATE INDEX named_meals_user_id ON named_meals (user_id);
  `);
  await db.run(`
    CREATE UNIQUE INDEX named_meals_user_id_meal_name ON named_meals (user_id, meal_name);
  `);
}

async function down(db) {
  await db.run(`DROP INDEX IF EXISTS named_meals_user_id_meal_name;`);
  await db.run(`DROP INDEX IF EXISTS named_meals_user_id;`);
  await db.run(`DROP TABLE IF EXISTS named_meals;`)
}

module.exports = { up, down };