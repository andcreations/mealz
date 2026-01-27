import * as React from 'react';
import { useState, useEffect } from 'react';

import { Log } from '../../../log';
import { usePatchState, useService } from '../../../hooks';
import { useTranslations } from '../../../i18n';
import { Loader, LoaderType, LoaderSize } from '../../../components';
import { AIMealScanService } from '../../../meals';
import { 
  AIMealScannerAnalyzeTranslations,
} from './AIMealScannerAnalyze.translations';

export interface AIMealScannerAnalyzeProps {
  photo: File;
}

interface AIMealScannerAnalyzeState {
  isAnalyzing: boolean;
}

export function AIMealScannerAnalyze(props: AIMealScannerAnalyzeProps) {
  const aiMealScanService = useService(AIMealScanService);
  const translate = useTranslations(AIMealScannerAnalyzeTranslations);

  const [state, setState] = useState<AIMealScannerAnalyzeState>({
    isAnalyzing: true,
  });
  const patchState = usePatchState(setState);

  useEffect(() => {
    Log.debug('Scanning photo');
    aiMealScanService.scanPhoto(props.photo).then(() => {
      Log.debug('Photo scanned');
      patchState({ isAnalyzing: false });
    });
  }, [props.photo]);

  return (
    <div className='mealz-ai-meal-scanner-analyze'>
      <div className='mealz-ai-meal-scanner-analyze-photo'>
        <img src={URL.createObjectURL(props.photo)}/>
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