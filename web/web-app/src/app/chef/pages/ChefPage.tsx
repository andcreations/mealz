import * as React from 'react';
import { useState, useEffect } from 'react';

import { useTranslations } from '../../i18n';
import { usePatchState, useService } from '../../hooks';
import { useBusEventListener } from '../../bus';
import { Center, LoaderType } from '../../components';
import { PageLoader, PageWrapper } from '../../page';
import {
  IngredientsCrudService,
  IngredientsLoadStatus,
  IngredientsTopics,
} from '../../ingredients';
import { MealPlanner } from '../components';
import { ChefPageTranslations } from './ChefPage.translations';

interface ChefPageState {
  ingredientsLoadStatus: IngredientsLoadStatus;
}

export function ChefPage() {
  const ingredientsCrudService = useService(IngredientsCrudService);

  const [state, setState] = useState<ChefPageState>({
    ingredientsLoadStatus: ingredientsCrudService.getLoadStatus(),
  });
  const patchState = usePatchState(setState);
  const translate = useTranslations(ChefPageTranslations);

  useEffect(
    () => {
      patchState({
        ingredientsLoadStatus: ingredientsCrudService.getLoadStatus(),
      });
    },
    [],
  );
  useBusEventListener(
    IngredientsTopics.IngredientsLoadStatusChanged,
    () => {
      patchState({
        ingredientsLoadStatus: ingredientsCrudService.getLoadStatus(),
      });
    }
  );

  const { ingredientsLoadStatus } = state;
  return (
    <PageWrapper title={translate('title')}>
      <Center>
        { ingredientsLoadStatus === IngredientsLoadStatus.Loaded &&
          <MealPlanner/>
        }
        { ingredientsLoadStatus === IngredientsLoadStatus.Loading &&
          <PageLoader
            type={LoaderType.Info}
            title={translate('hang-tight')}
            subTitle={translate('loading-ingredients')}
          />
        }
        { ingredientsLoadStatus === IngredientsLoadStatus.FailedToLoad &&
          <PageLoader
            type={LoaderType.Error}
            title={translate('try-again-later')}
            subTitle={translate('failed-to-load-ingredients')}
            delay={0}
          />
        }
      </Center>
    </PageWrapper>
  );
}