async function up(db) {
  await db.run(`
    CREATE TABLE meals (
      id TEXT PRIMARY KEY UNIQUE NOT NULL,
      details_version INTEGER NOT NULL,
      details BLOB NOT NULL
    );
  `);
}

async function down(db) {
  await db.run(`DROP TABLE IF EXISTS meals;`)
}

module.exports = { up, down };