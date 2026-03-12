import {
  BusEvent,
  BusListener,
  OnBootstrap,
  Service,
} from '@andcreations/common';
import { GWIngredient } from '@mealz/backend-ingredients-gateway-api';

import { logDebugEvent } from '../../log';
import { INGREDIENT_LANGUAGE } from '../../common';
import { stripDiacritics } from '../../utils';
import { IngredientsTopics } from '../bus';
import { SearchDocument, SearchIndex } from '../search';
import { SettingsService } from '../../settings';
import { IngredientsCrudService } from './IngredientsCrudService';
import { eventType } from '../event-log';

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
    if (!this.ingredientsCrudService.isLoaded()) {
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
      if (ingredient.isHidden) {
        return;
      }
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
    // Log.debug(
    //   `Indexed ${ingredients.length} ingredients for search ` +
    //   `in ${Date.now() - startTime}ms`,
    // );
    logDebugEvent(eventType('ingredients-indexed'), {
      total: ingredients.length,
      time: Date.now() - startTime,
    });
  }

  public search(pattern: string, limit: number): GWIngredient[] {
    const results = this.index.search(stripDiacritics(pattern), { limit });
    return results.ids
      .map(id => this.ingredientsCrudService.getById(id))
      .filter(ingredient => ingredient !== undefined);
  }
}
