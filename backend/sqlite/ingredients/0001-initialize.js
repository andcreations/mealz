async function up(db) {
  await db.run(`
    CREATE TABLE Ingredients (
      id TEXT PRIMARY KEY,
      detailsVersion INTEGER NOT NULL,
      details BLOB NOT NULL
    );
  `);
}

async function down(db) {
  await db.run(`DROP TABLE IF EXISTS Ingredients;`)
}

module.exports = { up, down };