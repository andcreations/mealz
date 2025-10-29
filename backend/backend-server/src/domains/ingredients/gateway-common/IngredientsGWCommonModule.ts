import { Module } from '@nestjs/common';
import { GWIngredientMapper } from './services';

@Module({
  providers: [GWIngredientMapper],
  exports: [GWIngredientMapper],
})
export class IngredientsGWCommonModule {
}