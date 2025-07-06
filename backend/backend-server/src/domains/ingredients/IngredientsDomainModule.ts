import { Module } from '@nestjs/common';

import {
  IngredientsCrudModule,
  IngredientsCrudGWModule,
} from './services/crud';
import { IngredientsSearchModule } from './services/search';

@Module({
  imports: [
    IngredientsCrudModule,
    IngredientsCrudGWModule,
    IngredientsSearchModule,
  ],
})
export class IngredientsDomainModule {
}