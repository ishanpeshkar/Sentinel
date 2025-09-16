import React, { useState, useCallback } from "react";
import Heatmap from "../components/map/Heatmap";
import ReviewModal from "../components/reviews/ReviewModal";
import "./MapPage.css";
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams

const MapPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  // Use the coordinates from URL if they exist, otherwise use a default
  const initialCenter = lat && lng ? [parseFloat(lat), parseFloat(lng)] : [51.505, -0.09];

  // Fetch reviews and summary based on latitude and longitude
  const fetchReviewsAndSummary = useCallback(async (latlng) => {
    setIsLoading(true);
    setIsSummaryLoading(true);
    setReviews([]);
    setSummary("");
    setSelectedLocation({
      name: `Area near ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`,
      coords: latlng,
    });

    // Fetch reviews
    try {
      const response = await fetch(
        `http://localhost:5000/api/reviews?lat=${latlng.lat}&lng=${latlng.lng}`
      );
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(data);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }

    // Fetch summary
    try {
      const summaryRes = await fetch(
        `http://localhost:5000/api/reviews/summary?lat=${latlng.lat}&lng=${latlng.lng}`
      );
      const summaryData = await summaryRes.json();
      if (summaryRes.ok) {
        setSummary(summaryData.summary);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    } finally {
      setIsSummaryLoading(false);
    }
  }, []);

  // Add new review
  const handleReviewAdded = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <div className="map-page-container">
      <div className="map-container">
        {/* Pass the initial center to the Heatmap component */}
        <Heatmap onMapClick={fetchReviewsAndSummary} center={initialCenter} />
      </div>

      <div className="review-panel-container">
        <h2>
          {selectedLocation ? selectedLocation.name : "Select a Location"}
        </h2>

        {/* Add Review Button */}
        {selectedLocation && (
          <button
            className="add-review-btn"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Review
          </button>
        )}

        {/* AI-Generated Summary */}
        {isSummaryLoading ? (
          <p style={{ color: "#2563eb", fontWeight: 600 }}>
            Loading AI-generated summary...
          </p>
        ) : (
          summary && (
            <div
              className="ai-summary-container"
              style={{ margin: "1rem 0", textAlign: "center" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                {/* Magic pen image */}
                <img
                  src="/magic-pen.png" // Replace with your actual image path
                  alt="Magic Pen"
                  style={{
                    width: "30px",
                    height: "30px",
                    transform: "rotate(-15deg)",
                  }}
                />
                <h3 style={{ margin: 0, color: "#2563eb", fontWeight: 600, fontSize: "1.2rem" }}>
                  AI-generated summary from reviews
                </h3>
              </div>
              <p
                style={{
                  marginTop: "0.5rem",
                  color: "#2563eb",
                  fontWeight: 500,
                }}
              >
                {summary}
              </p>
            </div>
          )
        )}

        {/* Loading reviews */}
        {isLoading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet. Be the first to add one!</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className={`review-card status-${review.status}`}
            >
              <div className="review-card-header">
                <span className="review-rating">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="review-prompt">{review.prompt}</p>
              {review.moreInfo && (
                <p className="review-text">{review.moreInfo}</p>
              )}
              <div className="review-status">
                Status: <span>{review.status.replace("_", " ")}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedLocation={selectedLocation}
        onReviewAdded={handleReviewAdded}
      />
    </div>
  );
};

export default MapPage;