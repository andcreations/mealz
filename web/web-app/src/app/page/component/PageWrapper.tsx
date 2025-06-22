import * as React from 'react';
import Container from 'react-bootstrap/Container';
import { PageNavbar } from './PageNavbar';

export interface PageWrapperProps {
}

export function PageWrapper(props: React.PropsWithChildren<PageWrapperProps>) {
  /** */
  return (
    <div className='mealz-page-wrapper'>
      <PageNavbar/>
      <Container>
        <div className='mealz-page-wrapper-content'>
          {props.children}
        </div>
      </Container>
    </div>
  );
}