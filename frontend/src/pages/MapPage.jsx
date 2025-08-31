import React, { useState, useCallback } from "react";
import Heatmap from "../components/map/Heatmap";
import ReviewPanel from "../components/reviews/ReviewPanel";
import "./MapPage.css";
import ReviewModal from "../components/reviews/ReviewModal";

const MapPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ... inside MapPage component
  const fetchReviews = useCallback(async (latlng) => {
    setIsLoading(true);
    setSelectedLocation({
      name: `Area near ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`,
      coords: latlng,
    });
    setReviews([]);

    try {
      const response = await fetch(
        `http://localhost:5000/api/reviews?lat=${latlng.lat}&lng=${latlng.lng}`
      );
      const data = await response.json();

      // THIS IS THE CRITICAL FIX:
      // Check if the response was successful and the data is an array before setting state.
      if (response.ok && Array.isArray(data)) {
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(data);
      } else {
        // If the API returns an error or non-array data, log it and keep reviews as an empty array.
        console.error("API did not return a valid array of reviews:", data);
        setReviews([]); // Ensure reviews state is a safe value (empty array)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]); // Also reset to empty array on network error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Callback to add a new review to the list after successful submission
  const handleReviewAdded = (newReview) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  return (
    <div className="map-page-container">
      <div className="map-container">
        <Heatmap onMapClick={fetchReviews} />
      </div>
      <div className="review-panel-container">
        <ReviewPanel
          selectedLocation={selectedLocation}
          reviews={reviews}
          isLoading={isLoading}
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
