-- Create table & indexes
CREATE TABLE Meals (
  id TEXT PRIMARY KEY,
  detailsVersion INTEGER NOT NULL,
  details BLOB NOT NULL
);
