async function up(db) {
  await db.run(`
    CREATE TABLE telegram_users (
      id TEXT PRIMARY KEY UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      telegram_chat_id INTEGER NOT NULL,
      telegram_user_id INTEGER NOT NULL,
      telegram_username TEXT NOT NULL,
      is_enabled INTEGER NOT NULL
    );
  `);
  await db.run(`
    CREATE UNIQUE INDEX telegram_users_user_id ON telegram_users (user_id);
  `);
  await db.run(`
    CREATE UNIQUE INDEX telegram_users_telegram_chat_id ON telegram_users (telegram_chat_id);
  `);
}

async function down(db) {
  await db.run(`DROP INDEX IF EXISTS telegram_users_user_id;`);
  await db.run(`DROP INDEX IF EXISTS telegram_users_telegram_chat_id;`);
  await db.run(`DROP TABLE IF EXISTS telegram_users;`)
}

module.exports = { up, down };