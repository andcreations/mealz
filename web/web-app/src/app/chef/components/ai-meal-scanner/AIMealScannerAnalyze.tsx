import * as React from 'react';
import { useState } from 'react';

import { usePatchState } from '../../../hooks';
import { useTranslations } from '../../../i18n';
import { Loader, LoaderType, LoaderSize } from '../../../components';
import { 
  AIMealScannerAnalyzeTranslations,
} from './AIMealScannerAnalyze.translations';

export interface AIMealScannerAnalyzeProps {
  photoUrl: string;
}

interface AIMealScannerAnalyzeState {
  isAnalyzing: boolean;
}

export function AIMealScannerAnalyze(props: AIMealScannerAnalyzeProps) {
  const translate = useTranslations(AIMealScannerAnalyzeTranslations);

  const [state, setState] = useState<AIMealScannerAnalyzeState>({
    isAnalyzing: true,
  });
  const patchState = usePatchState(setState);

  return (
    <div className='mealz-ai-meal-scanner-analyze'>
      <div className='mealz-ai-meal-scanner-analyze-photo'>
        <img src={props.photoUrl}/>
      </div>
      { state.isAnalyzing &&
        <Loader
          type={LoaderType.Info}
          size={LoaderSize.Small}
          subTitle={translate('analyzing')}
        />
      }
    </div>
  );
}