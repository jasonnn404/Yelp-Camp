import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Campgrounds = () => {
  const [campgrounds, setCampgrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampgrounds = async () => {
      try {
        const response = await axios.get('/api/campgrounds');
        setCampgrounds(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch campgrounds');
        setLoading(false);
      }
    };

    fetchCampgrounds();
  }, []);

  if (loading) return <Container><p className="text-center mt-5">Loading campgrounds...</p></Container>;
  if (error) return <Container><p className="text-center mt-5 text-danger">{error}</p></Container>;

  return (
    <Container>
      <h1 className="text-center mb-4">All Campgrounds</h1>
      <div className="d-flex justify-content-center mb-4">
        <Button as={Link} to="/campgrounds/new" variant="success">Add Campground</Button>
      </div>
      <Row xs={1} md={2} lg={3} className="g-4">
        {campgrounds.map(campground => (
          <Col key={campground._id}>
            <Card className="h-100">
              <Card.Img 
                variant="top" 
                src={campground.images && campground.images.length > 0 ? campground.images[0].url : 'https://res.cloudinary.com/dtj513ynu/image/upload/v1/placeholder'} 
                alt={campground.title}
              />
              <Card.Body>
                <Card.Title className="text-start">{campground.title}</Card.Title>
                <Card.Text className="text-start text-muted">
                  {campground.location}
                </Card.Text>
                <Card.Text className="text-start">
                  {campground.description.substring(0, 100)}...
                </Card.Text>
                <Button as={Link} to={`/campgrounds/${campground._id}`} variant="primary">View {campground.title}</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Campgrounds;
