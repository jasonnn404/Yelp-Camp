import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Github, Linkedin, Twitter } from 'react-bootstrap-icons';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-4 bg-dark text-white">
      <Container>
        <Row className="align-items-center">
          <Col md={4} className="mb-3 mb-md-0">
            <h5 className="text-uppercase fw-bold mb-2">YelpCamp</h5>
            <p className="mb-0 small">Discover and share the best camping spots around the world.</p>
          </Col>
            <Col md={4} className="mb-3 mb-md-0 text-center">
            <h5 className="text-uppercase fw-bold mb-2">Connect</h5>
            <div className="d-flex justify-content-center gap-3 fs-4">
              <a href="https://github.com" className="text-white">
                <Github />
              </a>
              <a href="https://linkedin.com" className="text-white">
                <Linkedin />
              </a>
              <a href="https://twitter.com" className="text-white">
                <Twitter />
              </a>
            </div>
          </Col>
          
          <Col md={4} className="text-md-end">
            <p className="mb-0">© 2025 YelpCamp. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
