import * as React from 'react';
import { Center, Loader, LoaderProps } from '../../components';

export interface PageLoaderProps extends LoaderProps {
}

export function PageLoader(props: PageLoaderProps) {
  return (
    <Center className='mealz-page-loader'>
      <Loader {...props}/>
    </Center>
  )
}