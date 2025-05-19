import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, ListGroup, Form } from 'react-bootstrap';
// You would need to implement the map component with mapbox-gl or similar
// import CampgroundMap from '../components/CampgroundMap';

const CampgroundDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campground, setCampground] = useState(null);
  const [review, setReview] = useState({ rating: 5, body: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // This would be set from your auth context
  const isAuthenticated = false;

  useEffect(() => {
    const fetchCampground = async () => {
      try {
        const response = await axios.get(`/api/campgrounds/${id}`);
        setCampground(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch campground details');
        setLoading(false);
      }
    };

    fetchCampground();
  }, [id]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview(prev => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      await axios.post(`/api/campgrounds/${id}/reviews`, review);
      // Refresh campground data to show the new review
      const response = await axios.get(`/api/campgrounds/${id}`);
      setCampground(response.data);
      // Reset form
      setReview({ rating: 5, body: '' });
    } catch (err) {
      console.error('Failed to submit review', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this campground?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/campgrounds/${id}`);
      navigate('/campgrounds');
    } catch (err) {
      console.error('Failed to delete campground', err);
    }
  };

  if (loading) return <Container><p className="text-center mt-5">Loading campground details...</p></Container>;
  if (error) return <Container><p className="text-center mt-5 text-danger">{error}</p></Container>;
  if (!campground) return <Container><p className="text-center mt-5">Campground not found</p></Container>;

  return (
    <Container>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Img 
              variant="top" 
              src={campground.images && campground.images.length > 0 ? campground.images[0].url : 'https://res.cloudinary.com/dtj513ynu/image/upload/v1/placeholder'} 
              className="campground-show-img"
              alt={campground.title}
            />
            <Card.Body>
              <Card.Title>{campground.title}</Card.Title>
              <Card.Text className="text-muted">{campground.location}</Card.Text>
              <Card.Text>{campground.description}</Card.Text>
              <Card.Text className="text-muted">
                Submitted by {campground.author ? campground.author.username : 'Unknown User'}
              </Card.Text>
              <Card.Text className="text-muted">
                ${campground.price}/night
              </Card.Text>
              {isAuthenticated && campground.author && campground.author._id === 'currentUserId' && (
                <div className="d-flex">
                  <Button as={Link} to={`/campgrounds/${id}/edit`} className="btn-info me-2">Edit</Button>
                  <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          {/* This is where you would include your map component */}
          <div className="mb-4" style={{ height: '300px', backgroundColor: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p className="text-muted">Map will be displayed here</p>
          </div>
          
          <Card>
            <Card.Body>
              <Card.Title>Reviews</Card.Title>
              
              {isAuthenticated ? (
                <Form onSubmit={handleReviewSubmit} className="mb-3">
                  <Form.Group className="mb-3">
                    <Form.Label>Rating</Form.Label>
                    <Form.Select 
                      name="rating" 
                      value={review.rating} 
                      onChange={handleReviewChange}
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Review</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="body"
                      value={review.body}
                      onChange={handleReviewChange}
                      placeholder="What did you think of this campground?"
                      required
                    />
                  </Form.Group>
                  <Button type="submit" variant="success">Submit Review</Button>
                </Form>
              ) : (
                <p><Link to="/login">Login</Link> to leave a review.</p>
              )}

              <ListGroup variant="flush">
                {campground.reviews && campground.reviews.length > 0 ? (
                  campground.reviews.map(review => (
                    <ListGroup.Item key={review._id} className="px-0">
                      <h5>{review.author ? review.author.username : 'Anonymous'}</h5>
                      <p>Rating: {review.rating}/5</p>
                      <p>{review.body}</p>
                      {isAuthenticated && review.author && review.author._id === 'currentUserId' && (
                        <Form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            // Handle review deletion
                          }} 
                          className="d-inline"
                        >
                          <Button type="submit" size="sm" variant="danger">Delete</Button>
                        </Form>
                      )}
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item className="px-0">No reviews yet.</ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <div className="mt-4">
        <Button as={Link} to="/campgrounds" variant="secondary">All Campgrounds</Button>
      </div>
    </Container>
  );
};

export default CampgroundDetails;
