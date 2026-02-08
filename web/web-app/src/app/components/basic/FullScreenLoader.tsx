import * as React from 'react';
import { useEffect, useState } from 'react';
import classNames from 'classnames';

import { usePatchState } from '../../hooks';
import { Loader, LoaderProps, LoaderSize, LoaderType } from './Loader';

export interface FullScreenLoaderProps extends LoaderProps{
  delay?: number;
}

interface FullScreenLoaderState {
  visible: boolean;
}

const LOADER_DEFAULT_DELAY = 2384;

export function FullScreenLoader(props: FullScreenLoaderProps) {
  const {
    delay = LOADER_DEFAULT_DELAY,
  } = props;  

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
      <Loader
        {...props}        
        delay={0}
      />
    </div>
  );
}