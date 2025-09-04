import React from "react";
import "./LandingPage.css";
import SearchBar from "../components/SearchBar";
import { Link } from "react-router-dom"; // Import Link

const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Sentinel</h1>
          <p>
            Your AI-powered guide to neighborhood safety.
            <br /> Search for a location to see its safety score or contribute
            your own experiences.
          </p>
          <SearchBar />

          <div className="cta-buttons">
            {/* Use Link component for navigation */}
            <Link to="/map" className="cta-primary">
              View Safety Heatmap
            </Link>
            <Link to="/map" className="cta-secondary">
              Submit a Review
            </Link>
          </div>
        </div>
      </section>
      <section id="features" className="features-section">
        <h2>How It Works</h2>
        <div className="features-wrapper">
          <div className="feature-card feature-left">
            <div className="feature-icon">🗂️</div>
            <div className="feature-content">
              <h3>Crowd-Sourced Data</h3>
              <p>
                Real experiences from real people. We gather and analyze safety
                reviews to provide a comprehensive and up-to-date understanding
                of any area.
              </p>
            </div>
          </div>

          <div className="feature-card feature-center">
            <div className="feature-icon">🤖</div>
            <div className="feature-content">
              <h3>AI-Powered Analysis</h3>
              <p>
                Our advanced AI models analyze sentiment, identify key safety
                concerns, and generate an easy-to-understand safety score for
                any location.
              </p>
            </div>
          </div>

          <div className="feature-card feature-right">
            <div className="feature-icon">🌡️</div>
            <div className="feature-content">
              <h3>Interactive Heatmaps</h3>
              <p>
                Visualize safety trends with our dynamic heatmaps. Easily
                identify safe zones and areas to be cautious of in any city.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;



