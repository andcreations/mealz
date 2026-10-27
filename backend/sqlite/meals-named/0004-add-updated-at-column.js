async function up(db) {
  await db.run(`
    ALTER TABLE named_meals ADD COLUMN updated_at INTEGER DEFAULT 0;
  `);
}

async function down(db) {
  await db.run(`
    ALTER TABLE named_meals DROP COLUMN updated_at;
  `);
}

module.exports = { up, down };