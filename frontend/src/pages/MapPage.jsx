import React, { useState, useCallback } from "react";
import Heatmap from "../components/map/Heatmap";
import ReviewPanel from "../components/reviews/ReviewPanel";
import "./MapPage.css";
import ReviewModal from "../components/reviews/ReviewModal";

const MapPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch reviews and summary based on latitude and longitude
  const fetchReviewsAndSummary = useCallback(async (latlng) => {
    setIsLoading(true);
    setIsSummaryLoading(true);
    setReviews([]);
    setSummary(''); // Reset previous summary
    setSelectedLocation({
      name: `Area near ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`,
      coords: latlng,
    });

    // Fetch reviews for the selected location
    try {
      const response = await fetch(
        `http://localhost:5000/api/reviews?lat=${latlng.lat}&lng=${latlng.lng}`
      );
      const data = await response.json();

      // Validate API response
      if (response.ok && Array.isArray(data)) {
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(data);
      } else {
        console.error("API did not return a valid array of reviews:", data);
        setReviews([]); // Ensure reviews state is a safe value (empty array)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]); // Reset to empty array on network error
    } finally {
      setIsLoading(false);
    }

    // Fetch summary
    try {
      const summaryRes = await fetch(`http://localhost:5000/api/reviews/summary?lat=${latlng.lat}&lng=${latlng.lng}`);
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

  // Callback to add a new review to the list after successful submission
  const handleReviewAdded = (newReview) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  return (
    <div className="map-page-container">
      <div className="map-container">
        <Heatmap onMapClick={fetchReviewsAndSummary} />
      </div>
      <div className="review-panel-container">
        <ReviewPanel
          selectedLocation={selectedLocation}
          reviews={reviews}
          isLoading={isLoading}
          summary={summary}
          isSummaryLoading={isSummaryLoading}
          onAddReviewClick={() => setIsModalOpen(true)} // Pass handler to open modal
        />
      </div>
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
