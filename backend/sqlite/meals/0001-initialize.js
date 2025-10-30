async function up(db) {
  await db.run(`
    CREATE TABLE Meals (
      id TEXT PRIMARY KEY,
      detailsVersion INTEGER NOT NULL,
      details BLOB NOT NULL
    );
  `);
}

async function down(db) {
  await db.run(`DROP TABLE IF EXISTS Meals;`)
}

module.exports = { up, down };