const express = require('express');
const router = express.Router();
const catchAsync = require('../../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../../middleware');
const campgrounds = require('../../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../../cloudinary');
const upload = multer({ storage });

// GET /api/campgrounds - get all campgrounds
router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.json(campgrounds);
}));

// POST /api/campgrounds - create a new campground
router.post('/', isLoggedIn, upload.array('images'), validateCampground, catchAsync(async (req, res) => {
  const campground = await campgrounds.createCampground(req);
  res.status(201).json(campground);
}));

// GET /api/campgrounds/:id - get a specific campground
router.get('/:id', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author'
      }
    })
    .populate('author');
  
  if (!campground) {
    return res.status(404).json({ message: 'Campground not found' });
  }
  
  res.json(campground);
}));

// PUT /api/campgrounds/:id - update a campground
router.put('/:id', isLoggedIn, isAuthor, upload.array('images'), validateCampground, catchAsync(async (req, res) => {
  const campground = await campgrounds.updateCampground(req);
  res.json(campground);
}));

// DELETE /api/campgrounds/:id - delete a campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  await campgrounds.deleteCampground(req);
  res.json({ message: 'Campground deleted successfully' });
}));

module.exports = router;
