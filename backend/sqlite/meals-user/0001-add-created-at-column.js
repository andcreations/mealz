async function up(db) {
  await db.run(`
    ALTER TABLE user_meals ADD COLUMN created_at INTEGER NOT NULL DEFAULT 0;
  `);
}

async function down(db) {
  await db.run(`
    ALTER TABLE user_meals DROP COLUMN created_at;
  `);
}

module.exports = { up, down };
