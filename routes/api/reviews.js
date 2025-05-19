const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../../middleware');
const reviews = require('../../controllers/reviews');

// GET /api/campgrounds/:id/reviews - get all reviews for a campground
router.get('/', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  });
  
  if (!campground) {
    return res.status(404).json({ message: 'Campground not found' });
  }
  
  res.json(campground.reviews);
}));

// POST /api/campgrounds/:id/reviews - create a new review
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
  const review = await reviews.createReview(req);
  res.status(201).json(review);
}));

// DELETE /api/campgrounds/:id/reviews/:reviewId - delete a review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
  await reviews.deleteReview(req);
  res.json({ message: 'Review deleted successfully' });
}));

module.exports = router;
