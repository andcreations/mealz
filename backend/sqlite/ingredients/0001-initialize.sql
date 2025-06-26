-- Create table & indexes
CREATE TABLE Ingredients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  detailsVersion INTEGER NOT NULL,
  details BLOB NOT NULL
);
CREATE UNIQUE INDEX Ingredients_name ON Ingredients (name);