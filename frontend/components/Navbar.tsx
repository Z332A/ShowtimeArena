// components/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useSession } from 'next-auth/react';

const AppNavbar: React.FC = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = !!session?.user;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} href="/">
          Showtime Arena
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Centered Nav Links */}
          <Nav className="mx-auto">
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
            <Nav.Link as={Link} href="/gallery">
              Gallery
            </Nav.Link>
          </Nav>

          {/* Right-Aligned Nav Links (Sign In/Up or My Profile) */}
          <Nav className="ms-auto">
            {!isAuthenticated ? (
              <>
                {/* Sign In & Sign Up buttons when NOT logged in */}
                <Nav.Link
                  as={Link}
                  href="/auth/signin"
                  className="btn btn-primary text-white me-2"
                >
                  Sign In
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  href="/auth/signup"
                  className="btn btn-primary text-white"
                >
                  Sign Up
                </Nav.Link>
              </>
            ) : (
              /* My Profile button when logged in */
              <Nav.Link
                as={Link}
                href="/profile"
                className="btn btn-primary text-white"
              >
                My Profile
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
