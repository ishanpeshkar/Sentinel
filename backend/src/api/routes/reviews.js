const express = require('express');
const { db } = require('../../config/firebase');
const axios = require('axios'); // Import axios

const router = express.Router();



// @route   POST api/reviews
// @desc    Submit a new safety review and analyze its sentiment
// @access  Public (for now)
router.get('/', async (req, res) => {
    try {
        const { lat, lng } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ msg: 'Latitude and Longitude query parameters are required.' });
        }

        const centerLat = parseFloat(lat);
        const centerLng = parseFloat(lng);
        
        // Define a search radius (approx. 500 meters)
        const latOffset = 0.0045; 
        const lngOffset = 0.0045;

        // Define the bounding box for the query
        const lowerLat = centerLat - latOffset;
        const upperLat = centerLat + latOffset;
        const lowerLng = centerLng - lngOffset;
        const upperLng = centerLng + lngOffset;

        // Query Firestore for reviews within the bounding box
        const reviewsRef = db.collection('reviews');
        const snapshot = await reviewsRef
            .where('location.lat', '>=', lowerLat)
            .where('location.lat', '<=', upperLat)
            .get();

        const results = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            // Additional filtering for longitude since Firestore can't do range filters on two different fields
            if (data.location.lng >= lowerLng && data.location.lng <= upperLng) {
                results.push({ id: doc.id, ...data });
            }
        });

        res.json(results);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST api/reviews
// @desc    Submit a new safety review
// ... (The rest of the file remains the same)
// @route   POST api/reviews
// @desc    Submit a new safety review and analyze its sentiment
// @access  Public (for now)
router.post('/', async (req, res) => {
    try {
        const { rating, prompt, moreInfo, location } = req.body;

        if (!rating || !prompt || !location || !location.lat || !location.lng) {
            return res.status(400).json({ msg: 'Please provide rating, prompt, and a valid location.' });
        }

        // --- AI Microservice Integration ---
        let sentimentScore = 0; // Default score
        const textToAnalyze = `${prompt}. ${moreInfo}`; // Combine prompt and details for analysis

        try {
            const sentimentResponse = await axios.post('http://127.0.0.1:8000/analyze', {
                text: textToAnalyze
            });
            if (sentimentResponse.data && typeof sentimentResponse.data.score === 'number') {
                sentimentScore = sentimentResponse.data.score;
            }
        } catch (error) {
            console.error("Error calling sentiment service:", error.message);
            // Don't block the review if the AI service is down. Just proceed with a neutral score.
        }
        // --- End of Integration ---

        const newReview = {
            rating: Number(rating),
            prompt,
            moreInfo: moreInfo || '',
            location: {
                lat: location.lat,
                lng: location.lng
            },
            upvotes: 0,
            downvotes: 0,
            createdAt: new Date().toISOString(),
            sentimentScore: sentimentScore // Store the AI-generated score!
        };
        
        const docRef = await db.collection('reviews').add(newReview);
        res.status(201).json({ id: docRef.id, ...newReview });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;