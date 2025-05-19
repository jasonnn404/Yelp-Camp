import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Row, Col } from "react-bootstrap";

const EditCampground = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: 0,
    description: "",
    deleteImages: [],
  });
  const [campground, setCampground] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCampground = async () => {
      try {
        const response = await axios.get(`/api/campgrounds/${id}`);
        setCampground(response.data);
        setFormData({
          title: response.data.title,
          location: response.data.location,
          price: response.data.price,
          description: response.data.description,
          deleteImages: [],
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch campground");
        setLoading(false);
      }
    };

    fetchCampground();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, images: e.target.files }));
  };

  const handleImageDeleteToggle = (filename) => {
    setFormData((prev) => {
      const deleteImages = [...prev.deleteImages];
      const index = deleteImages.indexOf(filename);

      if (index === -1) {
        deleteImages.push(filename);
      } else {
        deleteImages.splice(index, 1);
      }

      return { ...prev, deleteImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      for (const key in formData) {
        if (key !== "images" && key !== "deleteImages") {
          formDataToSend.append(key, formData[key]);
        }
      }

      if (formData.images) {
        for (let i = 0; i < formData.images.length; i++) {
          formDataToSend.append("images", formData.images[i]);
        }
      }

      formData.deleteImages.forEach((filename) => {
        formDataToSend.append("deleteImages[]", filename);
      });

      await axios.put(`/api/campgrounds/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(`/campgrounds/${id}`);
    } catch (error) {
      console.error("Error updating campground:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <Container>
        <p className="text-center mt-5">Loading...</p>
      </Container>
    );
  if (error)
    return (
      <Container>
        <p className="text-center mt-5 text-danger">{error}</p>
      </Container>
    );
  if (!campground)
    return (
      <Container>
        <p className="text-center mt-5">Campground not found</p>
      </Container>
    );

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h1 className="text-center mb-4">Edit {campground.title}</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a title.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a location.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price per night ($)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid price.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a description.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Add Images</Form.Label>
              <Form.Control
                type="file"
                name="images"
                onChange={handleFileChange}
                multiple
              />
              <Form.Text className="text-muted">
                Select multiple images to add to this campground.
              </Form.Text>
            </Form.Group>

            {campground.images && campground.images.length > 0 && (
              <Form.Group className="mb-3">
                <Form.Label>Delete Images</Form.Label>
                <div className="row row-cols-1 row-cols-md-2 g-3">
                  {campground.images.map((img, index) => (
                    <div key={index} className="col">
                      <div className="card">
                        <img
                          src={img.url}
                          className="card-img-top"
                          alt={`Campground ${index + 1}`}
                        />
                        <div className="card-body">
                          <Form.Check
                            type="checkbox"
                            id={`delete-image-${index}`}
                            label="Delete this image"
                            onChange={() =>
                              handleImageDeleteToggle(img.filename)
                            }
                            checked={formData.deleteImages.includes(
                              img.filename
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Form.Group>
            )}

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Campground"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate(`/campgrounds/${id}`)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditCampground;
