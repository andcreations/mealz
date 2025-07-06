import { Module } from '@nestjs/common';
import { IngredientsCommonModule } from '../common';
import { IngredientDBMapper } from './mapping';

@Module({
  imports: [
    IngredientsCommonModule,
  ],
  providers: [
    IngredientDBMapper,
  ],
  exports: [ 
    IngredientDBMapper,
  ],
})
export class IngredientsDBModule {
}