const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // User who is being reviewed
  reviewed_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // User giving the review
  reviewer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Skill being reviewed (optional - review could be about user overall)
  skill_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  },
  
  // Review Details
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    default: ''
  },
  
  // Review Type
  review_type: {
    type: String,
    enum: ['as_mentor', 'as_student'],
    required: true
  },
  
  // Detailed Ratings
  detailed_ratings: {
    communication: { type: Number, min: 1, max: 5 },
    teaching_quality: { type: Number, min: 1, max: 5 },
    reliability: { type: Number, min: 1, max: 5 },
    responsiveness: { type: Number, min: 1, max: 5 }
  },
  
  // Metadata
  helpful_count: { type: Number, default: 0 },
  unhelpful_count: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
