import * as React from 'react';

import { Center } from '../../components';
import { PageWrapper } from '../../page';
import { MealPlanner } from '../components';

export function ChefPage() {
  return (
    <PageWrapper>
      <Center>
        <MealPlanner/>
      </Center>
    </PageWrapper>
  );
}