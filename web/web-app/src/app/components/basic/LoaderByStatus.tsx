import * as React from 'react';
import { LoadStatus } from '../../common';
import { Loader, LoaderProps, LoaderType } from './Loader';

export interface LoaderByStatusProps extends LoaderProps {
  loadStatus: LoadStatus;
}

export function LoaderByStatus(props: LoaderByStatusProps) {
  const { loadStatus, ...loaderProps  } = props;
  const loaderType = loadStatus === LoadStatus.Loading
    ? LoaderType.Info
    : LoaderType.Error;

  return (
    <>
      { loadStatus !== LoadStatus.Loaded &&
        <Loader {...loaderProps} type={loaderType}/>
      }
    </>
  );
}
