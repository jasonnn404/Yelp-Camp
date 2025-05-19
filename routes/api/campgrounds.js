const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require("../../middleware");
const campgrounds = require("../../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../../cloudinary");
const upload = multer({ storage });
const Campground = require("../../models/campground");

router.get(
  "/",
  catchAsync(async (req, res) => {
    // Select minimum fields and limit the number of documents returned
    const campgrounds = await Campground.find({})
      .select("title geometry location") // Minimize fields
      .limit(50) // Limit number of results
      .lean(); // Return plain objects instead of Mongoose documents
    
    // Further process to ensure clean data and small payload size
    const processedCampgrounds = campgrounds.map(camp => ({
      _id: camp._id,
      title: camp.title,
      location: camp.location,
      geometry: camp.geometry ? {
        type: camp.geometry.type,
        coordinates: camp.geometry.coordinates
      } : null
    }));
    
    res.json(processedCampgrounds);
  })
);

// New endpoint specifically for map data with ultra-minimal payload
router.get(
  "/map-data",
  catchAsync(async (req, res) => {
    // Get only _id and coordinates for the map, nothing else
    const mapData = await Campground.find({ 
      geometry: { $exists: true } 
    })
      .select("_id geometry.coordinates")
      .limit(100)
      .lean();
    
    // Return an array with minimal data structure
    const simplifiedData = mapData.map(camp => ({
      id: camp._id,
      lng: camp.geometry?.coordinates?.[0] || 0,
      lat: camp.geometry?.coordinates?.[1] || 0
    }));
    
    res.json(simplifiedData);
  })
);

router.post(
  "/",
  isLoggedIn,
  upload.array("images"),
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = await campgrounds.createCampground(req);
    res.status(201).json(campground);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");

    if (!campground) {
      return res.status(404).json({ message: "Campground not found" });
    }

    res.json(campground);
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  upload.array("images"),
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = await campgrounds.updateCampground(req);
    res.json(campground);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    await campgrounds.deleteCampground(req);
    res.json({ message: "Campground deleted successfully" });
  })
);

module.exports = router;
