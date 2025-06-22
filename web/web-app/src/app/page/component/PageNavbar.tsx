import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

/** */
export function PageNavbar() {
  /** */
  return (
    <Navbar
      className='mealz-navbar bg-body-tertiary'
      fixed='top'
    >
      <Container className='mealz-navbar-container'>
        {/* <Navbar.Brand href='#/dashboard'>
          Netsparks
        </Navbar.Brand> */}
        {/* <Navbar.Toggle aria-controls='basic-navbar-nav'/> */}
        <Navbar.Collapse
          className='mealz-navbar-left'
          role='toolbar'
        >
          <Nav>
            <Nav.Link href='#/dashboard'>
              Dashboard
              {/* <MaterialIcon icon='dashboard'/> */}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <Navbar.Collapse
          className='mealz-navbar-right'
          role='toolbar'
        >
          <Nav>
            {/* <Nav.Link>
              <BackupStatusIcon/>
            </Nav.Link> */}
            <Nav.Link href='#/settings'>
              {/* <MaterialIcon
                icon='settings'
                title='Settings'
              /> */}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}