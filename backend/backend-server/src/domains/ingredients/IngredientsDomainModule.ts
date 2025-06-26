import { Module } from '@nestjs/common';
import { IngredientsSearchModule } from './services/search';

@Module({
  imports: [
    IngredientsSearchModule,
  ],
})
export class IngredientsDomainModule {}