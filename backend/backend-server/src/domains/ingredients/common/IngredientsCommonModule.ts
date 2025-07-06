import { Module } from '@nestjs/common';
import { IngredientDetailsV1PbMapper } from './mapping';

@Module({
  providers: [IngredientDetailsV1PbMapper],
  exports: [IngredientDetailsV1PbMapper],
})
export class IngredientsCommonModule {
}