import * as React from 'react';

import { Center } from '../../components';
import { PageWrapper } from '../../page';
import { MealPlannerWrapper } from '../components';

export function ChefPage() {
  return (
    <PageWrapper>
      <Center>
        <MealPlannerWrapper/>
      </Center>
    </PageWrapper>
  );
}