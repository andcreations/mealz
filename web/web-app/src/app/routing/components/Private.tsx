import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { IoC } from '@andcreations/common';

import { AuthUserService } from '../../auth';
import { logDebugEvent } from '../../event-log';
import { PathTo } from '../path';
import { RoutingService } from '../services';
import { eventType } from '../event-log';

const authUserService = IoC.resolve(AuthUserService);
const routingService = IoC.resolve(RoutingService);

export interface PrivateProps extends React.PropsWithChildren {
}

export function Private(props: PrivateProps) {
  if (!authUserService.isSignedIn()) {
    const hash = routingService.getHash();
    logDebugEvent(eventType('user-not-logged-in-to-access-private-route'), {
      hash,
    });
    return <Navigate to={PathTo.login(hash)}/>; 
  }

  return <>{props.children}</>;
}