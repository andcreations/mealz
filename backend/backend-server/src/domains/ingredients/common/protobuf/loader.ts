import * as path from 'path';
import { loadProtobuf } from '#mealz/backend-common';

export function loadIngredientDetailsV1Pb() {
  return loadProtobuf(
    path.join(__dirname, 'IngredientDetailsV1.proto'),
    'mealz.ingredients',
    'IngredientDetailsV1',
  );
}