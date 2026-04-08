async function up(db) {
  await db.run(`
    ALTER TABLE named_meals ADD COLUMN shared_by_user_id TEXT;
  `);
}

async function down(db) {
  await db.run(`
    ALTER TABLE named_meals DROP COLUMN shared_by_user_id;
  `);
}

module.exports = { up, down };