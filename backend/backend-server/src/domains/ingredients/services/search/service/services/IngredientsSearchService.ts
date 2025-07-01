import { Injectable, OnModuleInit } from '@nestjs/common';
import { Context } from '#mealz/backend-core';
import { Logger } from '#mealz/backend-logger';
import { SearchIndex } from '#mealz/backend-common';

import { IngredientsSearchRepository } from '../repositories';
import { IngredientSearchDocument } from '../types';
import { SearchIndexFactory, SearchIndexStrategy } from './SearchIndexFactory';

@Injectable()
export class IngredientsSearchService implements OnModuleInit {
  private static readonly LANGUAGE = 'en';
  private readonly search: SearchIndex<IngredientSearchDocument>;

  public constructor(
    private readonly logger: Logger,
    private readonly searchFactory: SearchIndexFactory,
    private readonly repository: IngredientsSearchRepository,
  ) {
    this.search = this.searchFactory.create(SearchIndexStrategy.MiniSearch);
  }

  public async onModuleInit(): Promise<void> {
    const context: Context = {
      correlationId: 'search-service-bootstap',
    }
    await this.loadIngredients(context);
  }
  
  private async loadIngredients(context: Context): Promise<void> {
    this.logger.info('Loading ingredients for search', context);

    let total = 0;
    let skipped = 0;
    const startTime = Date.now();

    const limit = 100;
    let lastId: string | undefined = undefined;
    while (true) {
      const ingredients = await this.repository.readFromLast(
        lastId,
        limit,
        context,
      );

      for (const ingredient of ingredients) {
        const name = ingredient.name[IngredientsSearchService.LANGUAGE];
        if (!name) {
          skipped++;
          continue;
        }
        await this.search.addDocument({
          id: ingredient.id,
          name,
        });
      }

      total += ingredients.length;
      if (ingredients.length < limit) {
        break;
      }
      lastId = ingredients[ingredients.length - 1].id;
    }

    this.logger.info('Loaded ingredients for search', {
      ...context,
      total,
      skipped,
      time: Date.now() - startTime,
    });
  }
}