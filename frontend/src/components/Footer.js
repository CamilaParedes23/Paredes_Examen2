import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer-custom mt-auto">
      <Container>
        <div className="text-center">
          <p className="mb-0">
            © 2025 Purchase Order Manager - Desarrollado con Spring Boot 3 + React
          </p>
          <small className="text-muted">
            Paredes - Lección 2 - Sistemas Distribuidos - ESPE
          </small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
