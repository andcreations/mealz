import { Module } from '@nestjs/common';

import {
  IngredientsCrudModule,
  IngredientsCrudGWModule,
} from './services/crud';
import { IngredientsSearchModule } from './services/search';

const SEARCH_ENABLED = false;

@Module({
  imports: [
    IngredientsCrudModule,
    IngredientsCrudGWModule,
    ...(SEARCH_ENABLED ? [IngredientsSearchModule] : []),
  ],
})
export class IngredientsDomainModule {
}