import React from "react";
import "./LandingPage.css";
import SearchBar from "../components/SearchBar";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Sentinel</h1>
          <p>
            Your AI-powered guide to neighborhood safety. <br />
            Explore safety scores or share your experiences.
          </p>
          <SearchBar />

          <div className="cta-buttons">
            <Link to="/map" className="cta-primary">View Safety Heatmap</Link>
            <Link to="/map" className="cta-secondary">Submit a Review</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2>How It Works</h2>
        <div className="features-wrapper">
          <div className="feature-card feature-left">
            <div className="feature-icon">🗂️</div>
            <div className="feature-content">
              <h3>Crowd-Sourced Data</h3>
              <p>Real experiences from real people. Gather and analyze safety reviews for any area.</p>
            </div>
          </div>

          <div className="feature-card feature-center">
            <div className="feature-icon">🤖</div>
            <div className="feature-content">
              <h3>AI-Powered Analysis</h3>
              <p>Advanced AI identifies safety concerns and generates easy-to-understand scores.</p>
            </div>
          </div>

          <div className="feature-card feature-right">
            <div className="feature-icon">🌡️</div>
            <div className="feature-content">
              <h3>Interactive Heatmaps</h3>
              <p>Visualize safety trends dynamically to spot safe zones or areas to avoid.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
