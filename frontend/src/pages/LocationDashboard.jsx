import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

import './LocationDashboard.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const LocationDashboard = () => {
    const { locationName } = useParams();
    const [locationData, setLocationData] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError('');

            try {
                // Step 1: Geocode the location name to get coordinates
                const provider = new OpenStreetMapProvider();
                const results = await provider.search({ query: locationName });

                if (results.length === 0) {
                    throw new Error(`Could not find location: ${locationName}`);
                }
                const { x: lng, y: lat, label } = results[0];
                setLocationData({ lat, lng, label });

                // Step 2: Fetch reviews and summary from our backend using coordinates
                const reviewsPromise = fetch(`http://localhost:5000/api/reviews?lat=${lat}&lng=${lng}`);
                const summaryPromise = fetch(`http://localhost:5000/api/reviews/summary?lat=${lat}&lng=${lng}`);
                
                const [reviewsRes, summaryRes] = await Promise.all([reviewsPromise, summaryPromise]);

                if (!reviewsRes.ok) throw new Error('Failed to fetch reviews.');
                if (!summaryRes.ok) throw new Error('Failed to fetch summary.');

                const reviewsData = await reviewsRes.json();
                const summaryData = await summaryRes.json();

                setReviews(reviewsData);
                setSummary(summaryData.summary);

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [locationName]);

    // --- Data Processing for Charts ---
    const ratingDistribution = reviews.reduce((acc, review) => {
        acc[review.rating - 1] = (acc[review.rating - 1] || 0) + 1;
        return acc;
    }, new Array(5).fill(0));

    const pieChartData = {
        labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
        datasets: [{
            label: '# of Reviews',
            data: ratingDistribution,
            backgroundColor: ['#FF4136', '#FF851B', '#FFDC00', '#B10DC9', '#28A745'],
        }],
    };
    
    // ... more chart data processing can be added here

    if (isLoading) return <div className="dashboard-container"><p>Loading dashboard for {locationName}...</p></div>;
    if (error) return <div className="dashboard-container"><p>Error: {error}</p></div>;

    return (
        <div className="dashboard-container">
            <h1>Safety Dashboard for <span>{locationData?.label}</span></h1>
            
            <div className="main-actions">
                <Link to={`/map?lat=${locationData?.lat}&lng=${locationData?.lng}`} className="map-link-btn">
                    View on Interactive Map
                </Link>
            </div>

            <div className="dashboard-grid">
                <div className="grid-item summary-card">
                    <h3>AI-Generated Summary</h3>
                    <p>{summary || "No summary available."}</p>
                </div>

                <div className="grid-item stats-card">
                    <h3>At a Glance</h3>
                    <div className="stat">
                        <span className="stat-value">{reviews.length}</span>
                        <span className="stat-label">Total Reviews</span>
                    </div>
                    {/* Add more stats here like average rating */}
                </div>

                <div className="grid-item chart-card large">
                    <h3>Review Distribution</h3>
                    <Pie data={pieChartData} />
                </div>
            </div>
        </div>
    );
};

export default LocationDashboard;