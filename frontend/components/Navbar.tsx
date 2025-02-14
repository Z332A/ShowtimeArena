// components/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import { Navbar, Nav, Container } from 'react-bootstrap';

const AppNavbar: React.FC = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} href="/">
          Showtime Arena
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} href="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} href="/new-booking">
              Create Booking
            </Nav.Link>
            <Nav.Link as={Link} href="/calendar">
              Calendar
            </Nav.Link>
            <Nav.Link as={Link} href="/view-booking">
              My Booking
            </Nav.Link>
            {/* Gallery link */}
            <Nav.Link as={Link} href="/gallery">
              Gallery
            </Nav.Link>
            {/* Sign Up link */}
            <Nav.Link as={Link} href="/auth/signup">
              Sign Up
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
