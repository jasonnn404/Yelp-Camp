import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { PlusCircleFill } from "react-bootstrap-icons";
import styles from "./Campgrounds.module.css";
import ClusterMap from "../components/ClusterMap";

const Campgrounds = () => {
  const [campgrounds, setCampgrounds] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchCampgrounds = async () => {
      try {
        console.log("Fetching data from Express server...");

        const mapResponse = await axios.get(
          "http://localhost:3000/api/campgrounds/map-data",
          {
            params: { _t: new Date().getTime() },
            timeout: 10000,
            withCredentials: false,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        console.log(
          "Map data received:",
          mapResponse.data?.length || 0,
          "items"
        );

        if (mapResponse.data && Array.isArray(mapResponse.data)) {
          setMapData(mapResponse.data);
          console.log("Sample map data:", mapResponse.data.slice(0, 2));
        } else {
          console.warn("Map data is not in expected format:", mapResponse.data);
          setMapData([]);
        }

        const campResponse = await axios.get(
          "http://localhost:3000/api/campgrounds",
          {
            params: { _t: new Date().getTime() + 1 },
            timeout: 10000,
            withCredentials: false,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        console.log(
          "Campground data received:",
          campResponse.data?.length || 0,
          "items"
        );

        if (campResponse.data && Array.isArray(campResponse.data)) {
          setCampgrounds(campResponse.data);
          console.log("Sample campground data:", campResponse.data.slice(0, 2));
        } else {
          console.warn(
            "Campground data is not in expected format:",
            campResponse.data
          );
          setCampgrounds([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        let errorMessage =
          "Failed to fetch data. Please ensure Express server is running at http://localhost:3000.";

        if (err.message && err.message.includes("431")) {
          errorMessage =
            "Error 431: Data size too large. Try clearing your browser cache and reloading.";
        } else if (err.response) {
          errorMessage = `Error ${err.response.status}: ${
            err.response.data?.message || err.response.statusText
          }`;
        } else if (err.message.includes("Network Error")) {
          errorMessage =
            "Network Error: Make sure the Express server is running at http://localhost:3000.";
        } else {
          errorMessage = `Error: ${err.message}`;
        }

        console.log("Error details:", err);
        setError(errorMessage);
        setMapData([]);
        setCampgrounds([]);
        setLoading(false);
      }
    };

    fetchCampgrounds();
  }, []);

  if (loading)
    return (
      <Container className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading campgrounds...</p>
      </Container>
    );
  if (error)
    return (
      <Container className="text-center mt-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </Container>
    );

  return (
    <Container fluid className="p-0">
      <div className="bg-dark text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <h1 className="display-4 fw-bold">Discover & Share</h1>
              <p className="lead">The perfect camping spots around the world</p>
              <Button
                as={Link}
                to="/campgrounds/new"
                variant="success"
                size="lg"
                className={`d-flex align-items-center mt-3 ${styles.addButton}`}
              >
                <PlusCircleFill className="me-2" />
                Add Campground
              </Button>
            </Col>{" "}
            <Col md={6}>
              <div className={styles.mapContainer}>
                {mapData.length > 0 || campgrounds.length > 0 ? (
                  <ClusterMap campgroundData={campgrounds} mapData={mapData} />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                    <div className="text-center">
                      <p className="mb-0">No campground data available</p>
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className={styles.campgroundsContainer}>
        <div
          className={`d-flex justify-content-between align-items-center ${styles.pageHeader}`}
        >
          <h2 className="fw-bold">All Campgrounds</h2>
          <div className="d-none d-md-block">
            <Button
              as={Link}
              to="/campgrounds/new"
              variant="success"
              className={`d-flex align-items-center shadow-sm ${styles.addButton}`}
            >
              <PlusCircleFill className="me-2" />
              Add Campground
            </Button>
          </div>
        </div>

        <Row xs={1} md={2} lg={3} className="g-4">
          {campgrounds.map((campground) => (
            <Col key={campground._id}>
              <Card
                className={`h-100 shadow border-0 hover-shadow ${styles.cardContainer}`}
              >
                <div className="overflow-hidden position-relative">
                  <Card.Img
                    variant="top"
                    src={
                      campground.images && campground.images.length > 0
                        ? campground.images[0].url
                        : "https://res.cloudinary.com/dtj513ynu/image/upload/v1/placeholder"
                    }
                    alt={campground.title}
                    className={styles.cardImage}
                  />
                  <div className="position-absolute bottom-0 start-0 p-2">
                    <span className={`badge ${styles.locationBadge}`}>
                      {campground.location}
                    </span>
                  </div>
                </div>
                <Card.Body>
                  <Card.Title className={styles.cardTitle}>
                    {campground.title}
                  </Card.Title>
                  <Card.Text className="text-muted small mb-3">
                    {campground.description
                      ? campground.description.substring(0, 100) + "..."
                      : "No description available"}
                  </Card.Text>
                  <Button
                    as={Link}
                    to={`/campgrounds/${campground._id}`}
                    variant="outline-primary"
                    className="w-100"
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default Campgrounds;
