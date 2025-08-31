import React from 'react';
import './ReviewPanel.css';
// ReviewForm is no longer needed here since it's in the modal
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

// 1. RECEIVE `onAddReviewClick` as a prop from the parent (MapPage)
const ReviewPanel = ({ selectedLocation, reviews, isLoading, onAddReviewClick }) => {
    const { currentUser } = useAuth(); // Use the context
    
    // 2. REMOVE this incorrect line:
    // const onAddReviewClick = () => {}; 

    return (
        <div className="review-panel">
            <div className="panel-header">
                <h2>{selectedLocation ? selectedLocation.name : "Click the Map"}</h2>
                <p>{selectedLocation ? "Safety Reviews" : "Select an area to see what people are saying."}</p>
            </div>
            
            <div className="review-list">
                {isLoading && <p className="loading-text">Loading reviews...</p>}
                {!isLoading && reviews.length === 0 && selectedLocation && (
                    <p className="no-reviews-text">No reviews for this area yet. Be the first to contribute!</p>
                )}
                {reviews.map(review => (
                    <div key={review.id} className="review-card">
                        <div className="review-rating">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                        <div className="review-prompt">{review.prompt}</div>
                        {review.moreInfo && <p className="review-text">{review.moreInfo}</p>}
                        <div className="review-actions">
                            <button>👍 {review.upvotes}</button>
                            <button>👎 {review.downvotes}</button>
                            <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>

            {selectedLocation && (
                <div className="review-submission-area">
                    {currentUser ? (
                        // 3. Now, this `onClick` will call the REAL function passed down from MapPage
                        <button className="add-review-btn" onClick={onAddReviewClick}>
                            + Add Your Review
                        </button>
                    ) : (
                        <div className="login-prompt">
                            <p>You must be logged in to submit a review.</p>
                            <Link to="/login" className="login-btn-prompt">Log In</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReviewPanel;