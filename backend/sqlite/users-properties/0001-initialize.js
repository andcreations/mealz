async function up(db) {
  await db.run(`
    CREATE TABLE user_properties (
      id TEXT PRIMARY KEY UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      property_id TEXT NOT NULL,
      data TEXT NOT NULL,
      modified_at INTEGER NOT NULL
    );
  `);
  await db.run(`
    CREATE UNIQUE INDEX user_properties_user_id_property_id ON user_properties (user_id, property_id);
  `);
}

async function down(db) {
  await db.run(`DROP INDEX IF EXISTS user_properties_user_id_property_id;`);
  await db.run(`DROP TABLE IF EXISTS user_properties;`);
}

module.exports = { up, down };
