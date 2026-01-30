import * as React from 'react';
import { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Log } from '../../../log';
import { usePatchState, useService } from '../../../hooks';
import { useTranslations } from '../../../i18n';
import { Loader, LoaderSize, LoaderType } from '../../../components';
import { NotificationsService } from '../../../notifications';
import { TakePhotoButton, useCamera } from '../../../camera';
import { 
  AIMealScannerCameraTranslations,
} from './AIMealScannerCamera.translations';

export interface AIMealScannerCameraProps {
  onPhotoTaken: (photo: File) => void;
}

const MAX_WIDTH = 1280;

interface AIMealScannerCameraState {
  isReady: boolean;
}

export function AIMealScannerCamera(props: AIMealScannerCameraProps) {
  const notificationsService = useService(NotificationsService);
  const translate = useTranslations(AIMealScannerCameraTranslations);

  const [state, setState] = useState<AIMealScannerCameraState>({
    isReady: false,
  });
  const patchState = usePatchState(setState);

  const { 
    videoRef, 
    start, 
    stop, 
    takePhoto, 
    error,
  } = useCamera({
    facingMode: 'environment',
    onReady: () => {
      Log.debug('Camera is ready');
      patchState({ isReady: true });
    },
  });

  const onTakePhoto = () => {
    takePhoto({ maxWidth: MAX_WIDTH })
      .then((photo) => {        
        props.onPhotoTaken(photo);
      })
      .catch((error) => {
        Log.error('Failed to take photo', error);
        notificationsService.error(translate('failed-to-take-photo'));
      });
  };

  // start camera on mount
  useEffect(
    () => {
      start();
      return () => {
        stop();
      };
    },
    [],
  );

  const loader = {
    type: () => {
      if (error) {
        return LoaderType.Error;
      }
      return LoaderType.Info;
    },

    subTitle: () => {
      if (error) {
        return translate('error');
      }
      return translate('setting-camera');
    },
  }

  const frameClassNames = classNames(
    'mealz-ai-meal-scanner-camera-frame',
    {
      'mealz-ai-meal-scanner-camera-frame-hidden': !state.isReady,
    },
  );
  const canTakePhoto = state.isReady && !error;

  return (
    <div className='mealz-ai-meal-scanner-camera'>
      { canTakePhoto &&
        <div className='mealz-ai-meal-scanner-camera-details'>
          {translate('details')}
        </div>
      }
      { !canTakePhoto &&
        <Loader
          type={loader.type()}
          size={LoaderSize.Small}
          subTitle={loader.subTitle()}
        />
      }
      <div className={frameClassNames}>
        <div className='mealz-ai-meal-scanner-camera-frame-overlay'>
        </div>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
        />
      </div>
      { canTakePhoto &&
        <TakePhotoButton
          className='mealz-ai-meal-scanner-camera-button'
          onClick={onTakePhoto}
        />
      }
    </div>
  );
}