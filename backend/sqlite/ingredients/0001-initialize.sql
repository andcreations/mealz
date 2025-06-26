-- Create table & indexes
CREATE TABLE Ingredients (
  id TEXT PRIMARY KEY,
  detailsVersion INTEGER NOT NULL,
  details BLOB NOT NULL
);
