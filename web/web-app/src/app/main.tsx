import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { IoC } from '@andcreations/common';
import { LocationService } from '@andcreations/web-common';

import { AuthService } from './auth';
import { SystemService } from './system';
import { EventLog } from './log';
import { AppRouter, PathTo, RoutingService } from './routing';
import { IngredientsCrudService, IngredientsSearch } from './ingredients';
import { MealsNamedService } from './meals';
import { NotificationsService } from './notifications';

function failedToRunApp(error: any): void {
  console.log('Failed to run the application', error);
}

async function bootstrapServices(): Promise<void> {
  IoC.resolve(SystemService);
  IoC.resolve(EventLog);
  IoC.resolve(RoutingService);
  IoC.resolve(IngredientsCrudService);
  IoC.resolve(IngredientsSearch);
  IoC.resolve(MealsNamedService);
  IoC.resolve(NotificationsService);
  IoC.bootstrap();
}

async function checkLoggedIn(): Promise<void> {
  const authService = IoC.resolve(AuthService);
  const isSignedIn = await authService.checkSignedIn();

  if (!isSignedIn) {
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
