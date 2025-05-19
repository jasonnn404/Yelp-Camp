import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

const Home = () => {
  return (
    <div className="home-hero d-flex text-center text-white">
      <Container className="d-flex flex-column justify-content-center align-items-center cover-container">
        <h1 className="display-3">YelpCamp</h1>
        <p className="lead mb-4">
          Welcome to YelpCamp! Jump right in and explore our many campgrounds.
          <br />
          Feel free to share some of your own and comment on others!
        </p>
        <Button as={Link} to="/campgrounds" variant="light" size="lg" className="fw-bold px-4">
          View Campgrounds
        </Button>
      </Container>
    </div>
  );
};

export default Home;
