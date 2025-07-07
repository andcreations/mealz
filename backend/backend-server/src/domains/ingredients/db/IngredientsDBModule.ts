import { Module } from '@nestjs/common';
import { IngredientDetailsV1Mapper, IngredientDBMapper } from './mapping';

@Module({
  imports: [],
  providers: [
    IngredientDetailsV1Mapper,
    IngredientDBMapper,
  ],
  exports: [ 
    IngredientDBMapper,
  ],
})
export class IngredientsDBModule {
}