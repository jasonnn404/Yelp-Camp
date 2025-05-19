import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

const NotFound = () => {
  return (
    <Container className="text-center mt-5">
      <h1 className="display-1">404</h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="lead mb-4">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button as={Link} to="/" variant="primary">
        Go Home
      </Button>
    </Container>
  );
};

export default NotFound;
