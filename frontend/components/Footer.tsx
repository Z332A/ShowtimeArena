// components/Footer.tsx
import React from 'react';
import { Container } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4 text-center">
      <Container>
        <p>&copy; {new Date().getFullYear()} Showtime Arena. All rights reserved.</p>
        <p>
          <a href="https://www.sffl.football/index.html" target="_blank" rel="noopener noreferrer" className="text-white">
            Showtime Flag
          </a>
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
