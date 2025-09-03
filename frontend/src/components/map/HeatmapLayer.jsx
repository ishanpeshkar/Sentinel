import React, { useState, useEffect } from 'react';
import { HeatmapLayer} from 'react-leaflet-heatmap-layer-v3';
import axios from 'axios';

const CustomHeatmapLayer = () => {
    const [points, setPoints] = useState([]);

    useEffect(() => {
        const fetchHeatmapData = async () => {
            try {
                // Fetch data from our new backend endpoint
                const response = await axios.get('http://localhost:5000/api/reviews/heatmap');
                
                const heatmapData = response.data.map(review => {
                    // The heatmap library needs an array: [lat, lng, intensity]
                    // Our sentimentScore is from -1 (bad) to 1 (good).
                    // We must normalize it to a 0 to 1 scale for the heatmap intensity.
                    const intensity = (review.sentimentScore + 1) / 2; // Maps [-1, 1] to [0, 1]
                    return [review.lat, review.lng, intensity];
                });

                setPoints(heatmapData);
            } catch (error) {
                console.error("Error fetching heatmap data:", error);
            }
        };

        fetchHeatmapData();
    }, []);

    if (points.length === 0) {
        return null;
    }

    return (
        <HeatmapLayer
            fitBoundsOnLoad
            points={points}
            longitudeExtractor={p => p[1]}
            latitudeExtractor={p => p[0]}
            intensityExtractor={p => p[2]}
            // Gradient matches our color scheme: Red -> Yellow -> Green
            gradient={{
                0.2: '#FF4136', // Bright Red (Negative)
                0.5: '#FFDC00', // Yellow (Neutral)
                1.0: '#28A745', // Fresh Green (Positive)
            }}
            radius={30}
            blur={20}
            max={1.0} // The max intensity is 1.0
            minOpacity={0.3}
        />
    );
};

export default CustomHeatmapLayer;