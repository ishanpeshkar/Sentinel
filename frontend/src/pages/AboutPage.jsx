import React from 'react';
import './StaticPage.css';

const AboutPage = () => {
    return (
        <div className="static-page-container">
            <h1>About Sentinel</h1>
            <p className="page-intro">Our mission is to empower communities with transparent and actionable safety information.</p>
            
            <div className="about-content">
                <h2>The Problem</h2>
                <p>In an increasingly complex world, knowing which areas are safe can be challenging. Official statistics are often outdated or lack the nuanced, on-the-ground context that only real human experience can provide. People often rely on word-of-mouth, which can be inconsistent and unreliable.</p>

                <h2>Our Solution</h2>
                <p>Sentinel bridges this gap by creating a living, breathing map of community safety. We provide a platform for individuals to share their experiences—good and bad—and use cutting-edge AI to transform those stories into clear, understandable insights. By crowd-sourcing data and applying intelligent analysis, we aim to build a tool that helps everyone from daily commuters and travelers to families looking for a new home.</p>

                <h2>The Technology</h2>
                <p>This platform is a showcase of modern software architecture, built with a scalable microservices pattern. Our React frontend provides a seamless user experience, while our Node.js backend orchestrates a suite of specialized Python AI services for tasks like sentiment analysis, summarization, and content moderation. This approach ensures our system is robust, maintainable, and ready for future growth.</p>
            </div>
        </div>
    );
};

export default AboutPage;