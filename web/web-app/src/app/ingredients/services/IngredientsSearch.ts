import {
  BusEvent,
  BusListener,
  OnBootstrap,
  Service,
} from '@andcreations/common';

import { Log } from '../../log';
import { INGREDIENT_LANGUAGE } from '../../common';
import { IngredientsTopics } from '../bus';
import { SearchDocument, SearchIndex } from '../search';
import { IngredientsCrudService } from './IngredientsCrudService';
import { GWIngredient } from '../../../../../../backend/backend-server/src/domains/ingredients/gateway-api';

interface IngredientDocument extends SearchDocument {
  id: string;
  name: string;
}

@Service()
@BusListener()
export class IngredientsSearch implements OnBootstrap {
  private index: SearchIndex<IngredientDocument>;

  public constructor(
    private readonly ingredientsCrudService: IngredientsCrudService,
  ) {}

  public async onBootstrap(): Promise<void> {
    this.buildIndex();
  }

  @BusEvent(IngredientsTopics.IngredientsRead)
  public onIngredientsRead(): void {
    this.buildIndex();
  }

  private buildIndex(): void {
  // get ingredients
    if (!this.ingredientsCrudService.hasIngredients()) {
      return;
    }
    const ingredients = this.ingredientsCrudService.getIngredients();

    const startTime = Date.now();
  // create index
    this.index = new SearchIndex<IngredientDocument>({
      fields: ['name'],
    });
    ingredients.forEach(ingredient => {
      this.index.addDocument({
        id: ingredient.id,
        name: ingredient.name[INGREDIENT_LANGUAGE],
      });
    });
    Log.debug(
      `Indexed ${ingredients.length} ingredients for search ` +
      `in ${Date.now() - startTime}ms`,
    );
  }

  public search(pattern: string, limit: number): GWIngredient[] {
    const results = this.index.search(pattern, { limit });
    return results.ids.map(id => this.ingredientsCrudService.getById(id));
  }
}
