import * as React from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

import { PageWrapper } from '../../page';
import { Center } from '../../components';
import { PathTo } from '../../routing';
import { useService } from '../../hooks';
import { AuthService } from '../../auth';

export function HomePage() {
  const authService = useService(AuthService);
  const navigate = useNavigate();

  const onSignOut = () => {
    authService.signOut();
    navigate(PathTo.signIn());
  };

  return (
    <PageWrapper>
      <Center>
        <Button 
          variant="primary"
          onClick={onSignOut}
        >
          Sign out
        </Button>
      </Center>
    </PageWrapper>
  );
}