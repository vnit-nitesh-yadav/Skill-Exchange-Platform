const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');

// POST: Create a new review
router.post('/', async (req, res) => {
  try {
    const { reviewed_user_id, reviewer_id, skill_id, rating, comment, review_type, detailed_ratings } = req.body;

    if (!reviewed_user_id || !reviewer_id || !rating || !review_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const review = new Review({
      reviewed_user_id,
      reviewer_id,
      skill_id,
      rating,
      comment,
      review_type,
      detailed_ratings
    });

    await review.save();

    // Update user's average rating
    const allReviews = await Review.find({ reviewed_user_id });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await User.findByIdAndUpdate(reviewed_user_id, {
      average_rating: avgRating,
      total_reviews: allReviews.length
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET: Get all reviews for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewed_user_id: req.params.userId })
      .populate('reviewer_id', 'username profilePicture')
      .populate('skill_id', 'name');
    
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET: Get a specific review
router.get('/:reviewId', async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId)
      .populate('reviewed_user_id')
      .populate('reviewer_id')
      .populate('skill_id');
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT: Update a review
router.put('/:reviewId', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Recalculate user's average rating
    const reviewed_user_id = review.reviewed_user_id;
    const allReviews = await Review.find({ reviewed_user_id });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await User.findByIdAndUpdate(reviewed_user_id, {
      average_rating: avgRating,
      total_reviews: allReviews.length
    });
    
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Delete a review
router.delete('/:reviewId', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Recalculate user's average rating
    const reviewed_user_id = review.reviewed_user_id;
    const allReviews = await Review.find({ reviewed_user_id });
    
    if (allReviews.length > 0) {
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await User.findByIdAndUpdate(reviewed_user_id, {
        average_rating: avgRating,
        total_reviews: allReviews.length
      });
    } else {
      await User.findByIdAndUpdate(reviewed_user_id, {
        average_rating: 0,
        total_reviews: 0
      });
    }
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET: Get reviews by a specific reviewer
router.get('/reviews-by/:reviewerId', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer_id: req.params.reviewerId })
      .populate('reviewed_user_id', 'username profilePicture')
      .populate('skill_id', 'name');
    
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
