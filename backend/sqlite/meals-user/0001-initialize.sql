-- Create table & indexes
CREATE TABLE UserMeals (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  mealId TEXT NOT NULL,
  typeId TEXT NOT NULL
);
CREATE UNIQUE INDEX UserMeals_userId_typeId ON UserMeals (userId, typeId);