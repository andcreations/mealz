async function up(db) {
  await db.run(`
    DROP INDEX named_meals_user_id_meal_name;
  `);
}

async function down(db) {
  await db.run(`
    CREATE INDEX named_meals_user_id_meal_name ON named_meals (user_id, meal_name);
  `);
}

module.exports = { up, down };