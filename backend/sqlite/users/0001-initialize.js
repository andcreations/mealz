async function up(db) {
  await db.run(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      roles TEXT NOT NULL
    );    
  `);
  await db.run(`
    CREATE UNIQUE INDEX users_email ON users (email);
  `);

  // Create the admin user with password "eatgood"
  await db.run(`
    INSERT INTO users (id,first_name,last_name,email,password,roles)
    VALUES (
      '01975110-fbb7-714d-bb5f-62f41fc39791',
      'Michael',
      'Cook',
      'mealz@mealz.andcreations.io',
      '$2b$10$evRzEyU6TIbAWrICfeyCl.ErSErJOj5C.dDtcSnSvXAFJBnk0kBgG',
      'admin'
    );
  `);
}

async function down(db) {
  await db.run(`DROP INDEX IF EXISTS users_email;`);
  await db.run(`DROP TABLE IF EXISTS users;`)
}

module.exports = { up, down };