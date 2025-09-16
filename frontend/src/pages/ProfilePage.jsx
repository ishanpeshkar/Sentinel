import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
    const { currentUser } = useAuth();
    const [myReviews, setMyReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMyReviews = async () => {
            if (!currentUser) return;

            try {
                const token = await currentUser.getIdToken();
                const response = await fetch('http://localhost:5000/api/reviews/my-reviews', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Failed to fetch reviews.');

                const data = await response.json();
                setMyReviews(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyReviews();
    }, [currentUser]);

    if (isLoading) {
        return (
            <div className="profile-container">
                <p className="loading-text">Loading your reviews...</p>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Welcome, {currentUser?.displayName || "User"}!</h1>
                <p className="user-email">Logged in as: {currentUser?.email}</p>
            </div>

            <div className="reviews-section">
                <h2>My Submitted Reviews</h2>
                {myReviews.length === 0 ? (
                    <p className="no-reviews">You haven't submitted any reviews yet. Start contributing to the community!</p>
                ) : (
                    <div className="reviews-grid">
                        {myReviews.map(review => (
                            <div key={review.id} className={`review-card status-${review.status}`}>
                                <div className="review-header">
                                    <span className="review-rating">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                                    <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="review-body">
                                    <p className="review-prompt">{review.prompt}</p>
                                    {review.moreInfo && <p className="review-text">{review.moreInfo}</p>}
                                </div>
                                <div className="review-footer">
                                    <span className={`review-status status-${review.status}`}>{review.status.replace('_', ' ')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
