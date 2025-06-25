-- Create table & indexes
CREATE TABLE Users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  roles TEXT NOT NULL
);
CREATE UNIQUE INDEX Users_email ON Users (email);

-- Create the admin user with password "eatgood"
INSERT INTO Users (id,email,password,roles)
VALUES (
  '01975110-fbb7-714d-bb5f-62f41fc39791',
  'mealz@andcreations.com',
  '$2b$10$evRzEyU6TIbAWrICfeyCl.ErSErJOj5C.dDtcSnSvXAFJBnk0kBgG',
  'admin'
);