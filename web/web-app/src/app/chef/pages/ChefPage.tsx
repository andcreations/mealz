import * as React from 'react';
import { useEffect, useState } from 'react';
import { GWIngredient } from '@mealz/backend-ingredients-gateway-api';

import { LoadStatus } from '../../common';
import { Log } from '../../log';
import { useTranslations } from '../../i18n';
import { usePatchState, useService } from '../../hooks';
import { LoaderType } from '../../components';
import { PageLoader, PageWrapper } from '../../page';
import { IngredientsCrudService } from '../../ingredients';
import { MealPlanner } from '../components';
import { ChefPageTranslations } from './ChefPage.translations';

interface ChefPageState {
  loadStatus: LoadStatus;
  ingredients?: GWIngredient[];
}

export function ChefPage() {
  const ingredientsCrudService = useService(IngredientsCrudService);

  const [state, setState] = useState<ChefPageState>({
    loadStatus: LoadStatus.Loading,
  });
  const patchState = usePatchState(setState);
  const translate = useTranslations(ChefPageTranslations);

  // initial load
  useEffect(
    () => {
      Promise.all([
        Log.logAndRethrow(
          () => ingredientsCrudService.loadAll(),
          'Failed to load ingredients',
        ),
      ])
      .then(([ingredients]) => {
        patchState({
          loadStatus: LoadStatus.Loaded,
          ingredients,
        });
      })
      .catch(() => {
        patchState({
          loadStatus: LoadStatus.FailedToLoad,
        });
      });
    },
    [],
  )

  return (
    <PageWrapper title={translate('title')}>
      { state.loadStatus === LoadStatus.Loaded &&
        <MealPlanner/>
      }
      { state.loadStatus === LoadStatus.Loading &&
        <PageLoader
          type={LoaderType.Info}
          title={translate('hang-tight')}
          subTitle={translate('loading-ingredients')}
        />
      }
      { state.loadStatus === LoadStatus.FailedToLoad &&
        <PageLoader
          type={LoaderType.Error}
          title={translate('try-again-later')}
          subTitle={translate('failed-to-load-ingredients')}
          delay={0}
        />
      }
    </PageWrapper>
  );
}