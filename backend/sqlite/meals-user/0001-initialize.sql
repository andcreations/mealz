-- Create table & indexes
CREATE TABLE UserMeals (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  mealId TEXT NOT NULL,
  type TEXT NOT NULL
);
CREATE UNIQUE INDEX UserMeals_user_meal_type ON UserMeals (userId, mealId, type);