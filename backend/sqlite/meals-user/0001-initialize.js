async function up(db) {
  await db.run(`
    CREATE TABLE user_meals (
      id TEXT PRIMARY KEY UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      meal_id TEXT NOT NULL,
      type_id TEXT NOT NULL,
      metadata BLOB
    );
  `);
  await db.run(`
    CREATE UNIQUE INDEX user_meals_userId_typeId ON user_meals (user_id, type_id);
  `);
}

async function down(db) {
  await db.run(`DROP INDEX IF EXISTS user_meals_user_id_type_id;`);
  await db.run(`DROP TABLE IF EXISTS user_meals;`)
}

module.exports = { up, down };