import * as React from 'react';
import { useState } from 'react';
import { GWMacros } from '@mealz/backend-meals-log-gateway-api';

import { usePatchState } from '../../../hooks';
import { AIMealScanResult } from '../../types';
import { AIMealScannerCamera } from './AIMealScannerCamera';
import { AIMealScannerAnalyze } from './AIMealScannerAnalyze';

export interface AIMealScannerProps {
  onAccept: (result: AIMealScanResult) => void;
  onClose: () => void;
}

interface AIMealScannerState {
  photo: File | null;
  hints: string;
}

export function AIMealScanner(props: AIMealScannerProps) {
  const [state, setState] = useState<AIMealScannerState>({
    photo: null,
    hints: '',
  });
  const patchState = usePatchState(setState);

  const onPhotoTaken = (photo: File, hints: string) => {
    patchState({ photo, hints });
  };

  const onAccept = (result: AIMealScanResult) => {
    props.onAccept(result);
  };

  const onClose = () => {
    props.onClose();
  };

  const canTakePhoto = state.photo === null;
  const canAnalyze = state.photo !== null;

  return (
    <div className='mealz-ai-meal-scanner'>
      { canTakePhoto &&
        <AIMealScannerCamera onPhotoTaken={onPhotoTaken}/>
      }
      { canAnalyze &&
        <AIMealScannerAnalyze 
          photo={state.photo}
          hints={state.hints}
          onAccept={onAccept}
          onClose={onClose}
        />
      }
    </div>
  );
}