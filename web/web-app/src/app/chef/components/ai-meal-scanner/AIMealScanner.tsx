import * as React from 'react';
import { useState } from 'react';

import { usePatchState } from '../../../hooks';
import { AIMealScannerCamera } from './AIMealScannerCamera';
import { AIMealScannerAnalyze } from './AIMealScannerAnalyze';

export interface AIMealScannerProps {
}

interface AIMealScannerState {
  photo: File | null;
}

export function AIMealScanner(props: AIMealScannerProps) {
  const [state, setState] = useState<AIMealScannerState>({
    photo: null,
  });
  const patchState = usePatchState(setState);

  const onPhotoTaken = (photo: File) => {
    patchState({ photo });
  };

  const canTakePhoto = state.photo === null;
  const canAnalyze = state.photo !== null;

  return (
    <div className='mealz-ai-meal-scanner'>
      { canTakePhoto &&
        <AIMealScannerCamera onPhotoTaken={onPhotoTaken}/>
      }
      { canAnalyze &&
        <AIMealScannerAnalyze photo={state.photo}/>
      }
    </div>
  );
}