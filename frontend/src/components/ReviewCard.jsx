import React, { useState, useEffect, useCallback } from 'react';
import API_URL from '../api';
import axios from 'axios';
import { FaStar, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import './ReviewCard.css';

function ReviewCard({ userId, currentUserId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    review_type: 'as_student',
    detailed_ratings: {
      communication: 5,
      teaching_quality: 5,
      reliability: 5,
      responsiveness: 5
    }
  });

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/reviews/user/${userId}`
      );
      setReviews(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!currentUserId) {
      alert('You must be logged in to leave a review');
      return;
    }
    
    if (currentUserId === userId) {
      alert('You cannot review yourself.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      await axios.post(
        `${API_URL}/api/reviews`,
        {
          reviewed_user_id: userId,
          reviewer_id: currentUserId,
          rating: newReview.rating,
          comment: newReview.comment,
          review_type: newReview.review_type,
          detailed_ratings: newReview.detailed_ratings
        },
        config
      );

      setNewReview({
        rating: 5,
        comment: '',
        review_type: 'as_student',
        detailed_ratings: {
          communication: 5,
          teaching_quality: 5,
          reliability: 5,
          responsiveness: 5
        }
      });
      setShowReviewForm(false);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  if (loading) {
    return <div className="review-loading">Loading reviews...</div>;
  }

  return (
    <div className="review-container">
      <div className="review-header">
        <h3>Reviews & Ratings</h3>
        {currentUserId && currentUserId !== userId && (
          <button
            className="btn-write-review"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>
        )}
      </div>

      {showReviewForm && (
        <form className="review-form" onSubmit={handleSubmitReview}>
          <div className="form-group">
            <label>Rating:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`star ${star <= newReview.rating ? 'active' : ''}`}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  size={24}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Review Type:</label>
            <select
              value={newReview.review_type}
              onChange={(e) => setNewReview({ ...newReview, review_type: e.target.value })}
            >
              <option value="as_student">Learning from them</option>
              <option value="as_mentor">Teaching with them</option>
            </select>
          </div>

          <div className="form-group">
            <label>Comment:</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your experience..."
              rows="4"
            />
          </div>

          <div className="detailed-ratings">
            <h4>Detailed Ratings (Optional):</h4>
            {['communication', 'teaching_quality', 'reliability', 'responsiveness'].map((criterion) => (
              <div key={criterion} className="rating-item">
                <label>{criterion.replace(/_/g, ' ')}:</label>
                <select
                  value={newReview.detailed_ratings[criterion]}
                  onChange={(e) =>
                    setNewReview({
                      ...newReview,
                      detailed_ratings: {
                        ...newReview.detailed_ratings,
                        [criterion]: parseInt(e.target.value)
                      }
                    })
                  }
                >
                  {[1, 2, 3, 4, 5].map((val) => (
                    <option key={val} value={val}>
                      {val} - {'⭐'.repeat(val)}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button type="submit" className="btn-submit-review">
            Submit Review
          </button>
        </form>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header-item">
                <div className="reviewer-info">
                  <img
                    src={review.reviewer_id?.profilePicture || 'https://via.placeholder.com/40'}
                    alt={review.reviewer_id?.username}
                    className="reviewer-avatar"
                  />
                  <div>
                    <h5>{review.reviewer_id?.username || 'Anonymous'}</h5>
                    <span className="review-type">{review.review_type}</span>
                  </div>
                </div>
                <div className="review-rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={16}
                      color={i < review.rating ? '#ffc107' : '#ddd'}
                    />
                  ))}
                  <span className="rating-value">({review.rating}/5)</span>
                </div>
              </div>

              <p className="review-comment">{review.comment}</p>

              {review.detailed_ratings && (
                <div className="detailed-ratings-display">
                  {Object.entries(review.detailed_ratings).map(([key, value]) => (
                    <span key={key} className="rating-badge">
                      {key.replace(/_/g, ' ')}: {value}/5
                    </span>
                  ))}
                </div>
              )}

              <div className="review-footer">
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
                <div className="review-helpful">
                  <button className="helpful-btn">
                    <FaThumbsUp size={12} /> Helpful ({review.helpful_count})
                  </button>
                  <button className="unhelpful-btn">
                    <FaThumbsDown size={12} /> ({review.unhelpful_count})
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewCard;
