import { Module } from '@nestjs/common';
import { IngredientsCrudAPIModule } from '@mealz/backend-ingredients-crud-service-api';

import { MealCalculator } from './services';

@Module({
  imports: [IngredientsCrudAPIModule.forRoot({})],
  providers: [MealCalculator],
  exports: [MealCalculator],
})
export class MealsCommonModule {}