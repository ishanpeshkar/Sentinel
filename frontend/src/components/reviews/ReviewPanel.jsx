import React from 'react';
import './ReviewPanel.css';
// ReviewForm is no longer needed here since it's in the modal
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

// 1. RECEIVE `onAddReviewClick`, `summary`, and `isSummaryLoading` as props from the parent (MapPage)
const ReviewPanel = ({ selectedLocation, reviews, setReviews, isLoading, summary, isSummaryLoading, onAddReviewClick }) => {
    const { currentUser } = useAuth(); // Use the context

    const handleVote = async (reviewId, voteType) => {
        if (!currentUser) {
            alert('Please log in to vote.');
            return;
        }

        // --- Optimistic Update ---
        const originalReviews = [...reviews];
        const updatedReviews = reviews.map(review => {
            if (review.id === reviewId) {
                const upvotedBy = review.upvotedBy || [];
                const downvotedBy = review.downvotedBy || [];
                const isUpvoted = upvotedBy.includes(currentUser.uid);
                const isDownvoted = downvotedBy.includes(currentUser.uid);

                const newReview = { ...review };
                newReview.upvotedBy = [...upvotedBy];
                newReview.downvotedBy = [...downvotedBy];

                if (voteType === 'upvote') {
                    if (isUpvoted) { // Undo upvote
                        newReview.upvotedBy = newReview.upvotedBy.filter(uid => uid !== currentUser.uid);
                    } else { // Add upvote
                        newReview.upvotedBy.push(currentUser.uid);
                        if (isDownvoted) { // Remove downvote if exists
                            newReview.downvotedBy = newReview.downvotedBy.filter(uid => uid !== currentUser.uid);
                        }
                    }
                } else if (voteType === 'downvote') {
                    if (isDownvoted) { // Undo downvote
                        newReview.downvotedBy = newReview.downvotedBy.filter(uid => uid !== currentUser.uid);
                    } else { // Add downvote
                        newReview.downvotedBy.push(currentUser.uid);
                        if (isUpvoted) { // Remove upvote if exists
                            newReview.upvotedBy = newReview.upvotedBy.filter(uid => uid !== currentUser.uid);
                        }
                    }
                }
                return newReview;
            }
            return review;
        });
        setReviews(updatedReviews);
        // --- End of Optimistic Update ---

        // --- API Call ---
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ voteType })
            });

            if (!response.ok) {
                throw new Error('Vote failed to save.');
            }
        } catch (error) {
            console.error(error);
            setReviews(originalReviews); // Revert on error
            alert('Something went wrong. Your vote was not saved.');
        }
    };

    return (
        <div className="review-panel">
            <div className="panel-header">
                <h2>{selectedLocation ? selectedLocation.name : "Click the Map"}</h2>
                <p>{selectedLocation ? "Safety Reviews" : "Select an area to see what people are saying."}</p>
            </div>

            {/* --- NEW SUMMARY SECTION --- */}
            {selectedLocation && (
                <div className="summary-section">
                    <h4>AI-Generated Area Summary</h4>
                    {isSummaryLoading ? (
                        <p className="loading-text">Generating summary...</p>
                    ) : (
                        <p className="summary-text">{summary}</p>
                    )}
                </div>
            )}
            
            <div className="review-list">
                {isLoading && <p className="loading-text">Loading reviews...</p>}
                {!isLoading && reviews.length === 0 && selectedLocation && (
                    <p className="no-reviews-text">No reviews for this area yet. Be the first to contribute!</p>
                )}
                {reviews.map(review => {
                    // Determine if the current user has voted
                    const userHasUpvoted = currentUser && review.upvotedBy?.includes(currentUser.uid);
                    const userHasDownvoted = currentUser && review.downvotedBy?.includes(currentUser.uid);
                    
                    return (
                        <div key={review.id} className="review-card">
                            <div className="review-rating">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                            <div className="review-prompt">{review.prompt}</div>
                            {review.moreInfo && <p className="review-text">{review.moreInfo}</p>}
                            <div className="review-actions">
                                <button 
                                    onClick={() => handleVote(review.id, 'upvote')} 
                                    className={`vote-btn ${userHasUpvoted ? 'active' : ''}`}
                                    title="Upvote"
                                >
                                    👍 {review.upvotedBy?.length || 0}
                                </button>
                                <button 
                                    onClick={() => handleVote(review.id, 'downvote')}
                                    className={`vote-btn ${userHasDownvoted ? 'active' : ''}`}
                                    title="Downvote"
                                >
                                    👎 {review.downvotedBy?.length || 0}
                                </button>
                                <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    );
                })}
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