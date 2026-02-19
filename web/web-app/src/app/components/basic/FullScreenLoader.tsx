import * as React from 'react';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Button } from 'react-bootstrap';

import { useTranslations } from '../../i18n';
import { usePatchState } from '../../hooks';
import { Loader, LoaderProps } from './Loader';
import { FullScreenLoaderTranslations } from './FullScreenLoader.translations';

export interface FullScreenLoaderProps extends LoaderProps {
  delay?: number;
  cancelable?: boolean;
  onCancel?: () => void;
}

interface FullScreenLoaderState {
  visible: boolean;
}

const LOADER_DEFAULT_DELAY = 1536;

export function FullScreenLoader(props: FullScreenLoaderProps) {
  const { delay = LOADER_DEFAULT_DELAY } = props;
  const translate = useTranslations(FullScreenLoaderTranslations);

  const [state, setState] = useState<FullScreenLoaderState>({
    visible: !delay,
  });
  const patchState = usePatchState(setState);

  useEffect(
    () => {
      const timer = delay
        ? setTimeout(
            () => patchState({ visible: true }),
            delay,
          )
        : undefined;
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      }
    },
  );

  const loaderClassNames = classNames([
    'mealz-full-screen-loader',
    { 'mealz-full-screen-loader-transparent': !state.visible }
  ]);

  return (
    <div className={loaderClassNames}>
      <div className='mealz-full-screen-loader-content'>
        <Loader
          {...props}        
          delay={0}
        />
        { props.cancelable &&
          <Button
            size='sm'
            onClick={props.onCancel}
          >
            { translate('cancel') }
          </Button>
        }
      </div>
    </div>
  );
}