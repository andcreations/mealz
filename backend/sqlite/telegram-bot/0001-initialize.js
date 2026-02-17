async function up(db) {
  await db.run(`
    CREATE TABLE outgoing_messages (
      id TEXT PRIMARY KEY UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      type_id TEXT NOT NULL,
      telegram_chat_id INTEGER NOT NULL,
      telegram_message_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL,
      sent_at INTEGER NOT NULL
    );
  `);

  await db.run(`
    CREATE INDEX outgoing_messages_user_id_type_id ON outgoing_messages (user_id, type_id);
  `);
}

async function down(db) {
  await db.run(`DROP INDEX IF EXISTS outgoing_messages_user_id_type_id;`);
  await db.run(`DROP TABLE IF EXISTS outgoing_messages;`)
}

module.exports = { up, down };