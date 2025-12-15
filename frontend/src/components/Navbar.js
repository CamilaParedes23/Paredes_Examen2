import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const CustomNavbar = () => {
  const location = useLocation();

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand as={Link} to="/orders">
          Purchase Order Manager
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/orders"
              className={location.pathname === '/orders' ? 'active' : ''}
            >
              Ver Órdenes
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/orders/new"
              className={location.pathname === '/orders/new' ? 'active' : ''}
            >
              Nueva Orden
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
