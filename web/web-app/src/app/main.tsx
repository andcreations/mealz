import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { IoC } from '@andcreations/common';
import { LocationService } from '@andcreations/web-common';

import { Log } from './log';
import { AuthService } from './auth';
import { AppRouter, PathTo, RoutingService } from './routing';

function failedToRunApp(error: any): void {
  console.log('Failed to run the application', error);
}

async function bootstrapServices(): Promise<void> {
  IoC.resolve(RoutingService);
  IoC.bootstrap();
}

async function checkLoggedIn(): Promise<void> {
  const authService = IoC.resolve(AuthService);
  const isLoggedIn = await authService.checkLoggedIn();
  Log.info(`User logged in: ${isLoggedIn}`);

  if (!isLoggedIn) {
    const locationService = IoC.resolve(LocationService);
    locationService.setHash(`#${PathTo.signIn()}`);
  }
}

async function bootstrap(): Promise<void> {
  await bootstrapServices();  
  await checkLoggedIn();

  const container = document.getElementById('app');
  const root = ReactDOMClient.createRoot(container);
  root.render(<AppRouter/>);
}

bootstrap()
  .catch((error) => {
    failedToRunApp(error);
  });
