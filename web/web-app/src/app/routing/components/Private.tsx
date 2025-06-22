import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { IoC } from '@andcreations/common';

import { AuthService } from '../../auth';
import { Log } from '../../log';
import { PathTo } from '../path';
import { RoutingService } from '../services';

const authService = IoC.resolve(AuthService);
const routingService = IoC.resolve(RoutingService);

export interface PrivateProps extends React.PropsWithChildren {
}

export function Private(props: PrivateProps) {
  if (!authService.isLoggedIn()) {
    const hash = routingService.getHash();
    Log.debug(
      `User not logged in. Cannot access private route ${Log.quote(hash)}`,
    );
    return <Navigate to={PathTo.login(hash)}/>; 
  }

  return <>{props.children}</>;
}