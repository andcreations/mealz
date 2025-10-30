async function up(db) {
  await db.run(`
    CREATE TABLE Users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      roles TEXT NOT NULL
    );    
  `);
  await db.run(`
    CREATE UNIQUE INDEX Users_email ON Users (email);
  `);

  // Create the admin user with password "eatgood"
  await db.run(`
    INSERT INTO Users (id,email,password,roles)
    VALUES (
      '01975110-fbb7-714d-bb5f-62f41fc39791',
      'mealz@andcreations.com',
      '$2b$10$evRzEyU6TIbAWrICfeyCl.ErSErJOj5C.dDtcSnSvXAFJBnk0kBgG',
      'admin'
    );
  `);
}

async function down(db) {
  await db.run(`DROP INDEX IF EXISTS Users_email;`);
  await db.run(`DROP TABLE IF EXISTS Users;`)
}

module.exports = { up, down };