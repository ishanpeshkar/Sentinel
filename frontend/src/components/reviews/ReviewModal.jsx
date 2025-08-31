import React from 'react';
import ReviewForm from './ReviewForm';
import './ReviewModal.css';

const ReviewModal = ({ isOpen, onClose, selectedLocation, onReviewAdded }) => {
    if (!isOpen) return null;

    const handleSuccess = (newReview) => {
        onReviewAdded(newReview); // Pass the new review object up
        onClose(); // Then close the modal
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Share Your Experience</h3>
                    <p>Reviewing: <strong>{selectedLocation?.name}</strong></p>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <ReviewForm 
                        selectedLocation={selectedLocation} 
                        onReviewAdded={handleSuccess} // Use the new handler
                    />
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;