import * as React from 'react';
import { useState, useEffect } from 'react';
import classNames from 'classnames';

import { usePatchState } from '../../hooks';
import { Pot } from './Pot';
import { TippedPot } from './TippedPot';

export enum LoaderType {
  Info,
  Error
}

export interface LoaderProps {
  title?: string;
  subTitle?: string;
  type?: LoaderType;
  delay?: number;
}

interface LoaderState {
  visible: boolean;
}

const DEFAULT_DELAY = 384;

export function Loader(props: LoaderProps) {
  const { type = LoaderType.Info, delay = DEFAULT_DELAY } = props;

  const [state, setState] = useState<LoaderState>({
    visible: !delay,
  });
  const patchState = usePatchState(setState);

  useEffect(
    () => {      
      const timer = props.delay
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
    [],
  );

  const wrapperClassNames = classNames([
    'mealz-loader-wrapper',
    { 'mealz-loader-wrapper-hidden': !state.visible }
  ]);
  const titleClassNames = classNames([
    'mealz-loader-title',
    { 'mealz-error': type === LoaderType.Error },
  ]);
  const subTitleClassNames = classNames([
    'mealz-loader-sub-title',
    { 'mealz-error': type === LoaderType.Error },
  ]);

  return (
    <div className={wrapperClassNames}>
      <div className='mealz-loader'>
        { type === LoaderType.Info &&
          <>
            <div className='mealz-loader-steam'></div>
            <div className='mealz-loader-steam'></div>
            <div className='mealz-loader-steam'></div>
            <Pot className='mealz-loader-pot'/>
          </>
        }
        { type === LoaderType.Error &&
          <TippedPot className='mealz-loader-pot'/>
        }
      </div>
      { !!props.title &&
        <div className={titleClassNames}>
          { props.title }
        </div>
      }
      { !!props.subTitle &&
        <div className={subTitleClassNames}>
          { props.subTitle }
        </div>
      }
    </div>
  );
}