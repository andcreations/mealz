import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import {
  GWMacros,
} from '@mealz/backend-meals-log-gateway-api';
import {
  GWMealDailyPlanGoals,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { Log } from '../../../log';
import { usePatchState, useService } from '../../../hooks';
import { useTranslations } from '../../../i18n';
import { 
  Loader,
  LoaderType,
  LoaderSize,
  MacrosSummary,
} from '../../../components';
import { 
  AIMealScanService,
  MealsDailyPlanService,
  ScanPhotoResult,
} from '../../../meals';
import { AIMealScanResult } from '../../types';
import { 
  AIMealScannerAnalyzeTranslations,
} from './AIMealScannerAnalyze.translations';

export interface AIMealScannerAnalyzeProps {
  photo: File;
  onAccept: (result: AIMealScanResult) => void;
  onClose: () => void;
}

interface AIMealScannerAnalyzeState {
  isAnalyzing: boolean;
  error?: boolean;
  result?: ScanPhotoResult;
  goals?: GWMealDailyPlanGoals;
}

export function AIMealScannerAnalyze(props: AIMealScannerAnalyzeProps) {
  const aiMealScanService = useService(AIMealScanService);
  const mealsDailyPlanService = useService(MealsDailyPlanService);
  const translate = useTranslations(AIMealScannerAnalyzeTranslations);

  const [state, setState] = useState<AIMealScannerAnalyzeState>({
    isAnalyzing: true,
  });
  const patchState = usePatchState(setState);

  useEffect(() => {
    Promise.all([
      Log.logAndRethrow(
        () => aiMealScanService.scanPhoto(props.photo),
        'Failed to scan photo',
      ),
      Log.logAndRethrow(
        () => mealsDailyPlanService.readCurrentEntry(),
        'Failed to read current goals',
      ),
    ])
    .then(([result, currentGoalsEntry]) => {
      patchState({
        isAnalyzing: false,
        result,
        goals: currentGoalsEntry?.goals,
      });
    })
    .catch(() => {
      patchState({
        isAnalyzing: false,
        error: true,
      });
    });
  }, [props.photo]);

  const onAccept = () => {
    const macros = totalMacros();
    const photoScanResult = state.result;
    if (!photoScanResult) {
      return;
    }
    props.onAccept({
      nameOfAllMeals: photoScanResult?.nameOfAllMeals,
      weightOfAllMeals: photoScanResult?.weightOfAllMeals,
      macros,
    });
  }

  const onCancel = () => {
    props.onClose();
  }

  const onClose = () => {
    props.onClose();
  }

  const loader = {
    type: () => {
      if (state.error) {
        return LoaderType.Error;
      }
      return LoaderType.Info;
    },

    subTitle: () => {
      if (state.error) {
        return translate('error');
      }
      return translate('analyzing');
    },
  }

  const totalMacros = () => {
    const totals: GWMacros = {
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
    };
    (state.result?.meals ?? []).forEach((meal) => {
      totals.calories += meal.calories;
      totals.carbs += meal.carbs;
      totals.protein += meal.protein;
      totals.fat += meal.fat;
    });
    return totals;
  }

  const noMeals = !state.isAnalyzing && state.result?.meals?.length === 0;
  const hasMeals = !state.isAnalyzing && state.result?.meals?.length > 0;

  return (
    <div className='mealz-ai-meal-scanner-analyze'>
      <div className='mealz-ai-meal-scanner-analyze-photo'>
        <img src={URL.createObjectURL(props.photo)}/>
      </div>
      { state.isAnalyzing &&
        <Loader
          type={loader.type()}
          size={LoaderSize.Small}
          subTitle={loader.subTitle()}
        />
      }
      { noMeals && 
        <>
          <div className='mealz-ai-meal-scanner-analyze-no-meals'>
            { translate('no-meals') }
          </div>
          <div className='mealz-ai-meal-scanner-analyze-button-bar'>
            <Button
              variant='secondary'
              size='sm'
              onClick={onClose}
            >
              { translate('close') }
            </Button>
          </div>
        </>
      }
      { hasMeals &&
        <>
          <div className='mealz-ai-meal-scanner-analyze-all-meals-name'>
            { state.result.nameOfAllMeals }
          </div>
          <MacrosSummary
            className='mealz-ai-meal-scanner-analyze-totals'
            macrosSummary={totalMacros()}
            goals={state.goals}
          />
          <div className='mealz-ai-meal-scanner-analyze-button-bar'>
            <Button
              variant='primary'
              size='sm'
              onClick={onAccept}
            >
              { translate('accept') }
            </Button>
            <Button
              variant='secondary'
              size='sm'
              onClick={onCancel}
            >
              { translate('cancel') }
            </Button>
          </div>
        </>
      }
    </div>
  );
}