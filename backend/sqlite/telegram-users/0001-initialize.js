async function up(db) {
  // telegram users
  await db.run(`
    CREATE TABLE telegram_users (
      user_id TEXT PRIMARY KEY UNIQUE NOT NULL,
      telegram_chat_id INTEGER NOT NULL,
      telegram_user_id INTEGER NOT NULL,
      telegram_username TEXT NOT NULL,
      is_enabled INTEGER NOT NULL
    );
  `);
  await db.run(`
    CREATE UNIQUE INDEX telegram_users_telegram_chat_id ON telegram_users (telegram_chat_id);
  `);

  // telegram tokens
  await db.run(`
    CREATE TABLE telegram_tokens (
      user_id TEXT PRIMARY KEY UNIQUE NOT NULL,
      type TEXT NOT NULL,
      token TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    );
  `);
  await db.run(`
    CREATE UNIQUE INDEX telegram_tokens_token ON telegram_tokens (token);
  `);
}

async function down(db) {
  // telegram users
  await db.run(`DROP INDEX IF EXISTS telegram_users_telegram_chat_id;`);
  await db.run(`DROP TABLE IF EXISTS telegram_users;`)

  // telegram tokens
  await db.run(`DROP INDEX IF EXISTS telegram_tokens_token;`);
  await db.run(`DROP TABLE IF EXISTS telegram_tokens;`)
}

module.exports = { up, down };