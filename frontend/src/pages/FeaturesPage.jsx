import React from 'react';
import './StaticPage.css';

const FeaturesPage = () => {
    return (
        <div className="static-page-container">
            <h1>Our Features</h1>
            <p className="page-intro">Sentinel is packed with powerful tools to help you understand and navigate your world with confidence.</p>
            
            <div className="feature-grid">
                <div className="feature-item">
                    <h3>Interactive Safety Heatmap</h3>
                    <p>Visualize crowd-sourced safety data in real-time. Our dynamic map uses a clear color-coded system—green for safe, red for areas needing caution—powered by thousands of user reviews.</p>
                </div>
                <div className="feature-item">
                    <h3>AI-Powered Sentiment Analysis</h3>
                    <p>We don't just count stars. A sophisticated AI model reads and understands the sentiment behind every review, providing a nuanced safety score that reflects the true feeling of an area.</p>
                </div>
                <div className="feature-item">
                    <h3>GenAI Area Summaries</h3>
                    <p>Get the bigger picture instantly. Our generative AI analyzes all reviews for a selected location and produces a concise, human-readable summary, highlighting key safety trends and concerns.</p>
                </div>
                <div className="feature-item">
                    <h3>Automated Content Moderation</h3>
                    <p>To ensure a safe and respectful platform, our AI-driven moderation system automatically flags and hides toxic or inappropriate content, keeping the community helpful and constructive.</p>
                </div>
                <div className="feature-item">
                    <h3>Community Voting System</h3>
                    <p>Your voice matters. Upvote helpful reviews to give them more visibility or downvote irrelevant ones. This community feedback helps surface the most reliable and timely information.</p>
                </div>
                <div className="feature-item">
                    <h3>Personalized User Profiles</h3>
                    <p>Create an account to track all your contributions. Your personal profile page lets you view your submission history and see the status of your reviews.</p>
                </div>
            </div>
        </div>
    );
};

export default FeaturesPage;