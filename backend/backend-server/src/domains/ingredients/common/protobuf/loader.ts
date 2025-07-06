import * as path from 'path';
import { loadProtobufFromFile } from '#mealz/backend-common';

export function loadIngredientDetailsV1Pb() {
  return loadProtobufFromFile(
    path.join(__dirname, 'IngredientDetailsV1Pb.proto'),
    'mealz.ingredients',
    'IngredientDetailsV1',
  );
}