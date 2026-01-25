import * as React from 'react';
import { useState } from 'react';

import { usePatchState } from '../../../hooks';
import { AIMealScannerCamera } from './AIMealScannerCamera';
import { AIMealScannerAnalyze } from './AIMealScannerAnalyze';

export interface AIMealScannerProps {
}

interface AIMealScannerState {
  photoUrl: string | null;
}

export function AIMealScanner(props: AIMealScannerProps) {
  const [state, setState] = useState<AIMealScannerState>({
    photoUrl: null,
  });
  const patchState = usePatchState(setState);

  const onPhotoTaken = (photo: File) => {
    const photoUrl = URL.createObjectURL(photo);
    patchState({ photoUrl });
  };

  const canTakePhoto = state.photoUrl === null;
  const canAnalyze = state.photoUrl !== null;

  return (
    <div className='mealz-ai-meal-scanner'>
      { canTakePhoto &&
        <AIMealScannerCamera onPhotoTaken={onPhotoTaken}/>
      }
      { canAnalyze &&
        <AIMealScannerAnalyze photoUrl={state.photoUrl}/>
      }
    </div>
  );
}