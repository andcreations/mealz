import {
  BusEvent,
  BusListener,
  OnBootstrap,
  Service,
} from '@andcreations/common';

import { Log } from '../../log';
import { INGREDIENT_LANGUAGE } from '../../common';
import { IngredientsTopics } from '../bus';
import { GWIngredient } from '@mealz/backend-ingredients-gateway-api';

import { SearchDocument, SearchIndex } from '../search';
import { SettingsService } from '../../settings';
import { IngredientsCrudService } from './IngredientsCrudService';
import { stripDiacritics } from '../../utils';

interface IngredientDocument extends SearchDocument {
  id: string;
  primaryName: string;
  secondaryName?: string;
}

@Service()
@BusListener()
export class IngredientsSearch implements OnBootstrap {
  private index: SearchIndex<IngredientDocument>;

  public constructor(
    private readonly settings: SettingsService,
    private readonly ingredientsCrudService: IngredientsCrudService,
  ) {}

  public async onBootstrap(): Promise<void> {
    this.tryBuildIndex();
  }

  @BusEvent(IngredientsTopics.IngredientsLoadStatusChanged)
  public onIngredientsLoadStatusChanged(): void {
    this.tryBuildIndex();
  }

  private tryBuildIndex(): void {
    if (!this.ingredientsCrudService.loaded()) {
      return;
    }
    this.buildIndex();
  }

  private buildIndex(): void {
    const ingredients = this.ingredientsCrudService.getIngredients();
    const secondaryLanguage = this.settings.getIngredientsSecondaryLanguage();
    const startTime = Date.now();
  // create index
    this.index = new SearchIndex<IngredientDocument>({
      fields: ['primaryName', 'secondaryName'],
    });
    ingredients.forEach(ingredient => {
      this.index.addDocument({
        id: ingredient.id,
        primaryName: stripDiacritics(ingredient.name[INGREDIENT_LANGUAGE]),
        ...((secondaryLanguage && ingredient.name[secondaryLanguage])
          ? {
              secondaryName: stripDiacritics(ingredient.name[secondaryLanguage])
            }
          : {}
      ),
      });
    });
    Log.debug(
      `Indexed ${ingredients.length} ingredients for search ` +
      `in ${Date.now() - startTime}ms`,
    );
  }

  public search(pattern: string, limit: number): GWIngredient[] {
    const results = this.index.search(stripDiacritics(pattern), { limit });
    return results.ids.map(id => this.ingredientsCrudService.getById(id));
  }
}
