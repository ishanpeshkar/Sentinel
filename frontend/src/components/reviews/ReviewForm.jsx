import React, { useState } from 'react';
import './ReviewForm.css';

const PRESET_PROMPTS = [
  'Good lighting',
  'Felt unsafe',
  'Lots of people around',
  'Quiet and deserted',
  'Visible police presence',
  'Poorly maintained area',
];

const ReviewForm = ({ selectedLocation, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [moreInfo, setMoreInfo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (rating === 0 || prompt === '') {
      setError('Rating and a safety prompt are required.');
      return;
    }

    // In a real app, 'location' would come from map state
    const reviewData = {
      rating,
      prompt,
      moreInfo,
      location: selectedLocation.coords,
    };

    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const newReview = await response.json();
      onReviewAdded(newReview); // Pass the new review up to MapPage

      setSuccess('Thank you! Your review has been submitted.');
      // Reset form
      setRating(0);
      setPrompt('');
      setMoreInfo('');
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      {error && <p className="form-error">{error}</p>}
      {success && <p className="form-success">{success}</p>}

      <div className="form-group">
        <label>Your Safety Rating*</label>
        <div className="star-rating">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <span
                key={ratingValue}
                className={
                  ratingValue <= (hoverRating || rating)
                    ? 'star-filled'
                    : 'star-empty'
                }
                onClick={() => setRating(ratingValue)} // <-- THIS WAS THE FIX
                onMouseEnter={() => setHoverRating(ratingValue)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </span>
            );
          })}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="prompt">What did you notice?*</label>
        <select id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} required>
          <option value="" disabled>Select a prompt...</option>
          {PRESET_PROMPTS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="more-info">More Info (Optional)</label>
        <textarea
          id="more-info"
          value={moreInfo}
          onChange={(e) => setMoreInfo(e.target.value)}
          placeholder="Add any other details here..."
        ></textarea>
      </div>

      <button type="submit" className="submit-btn">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;