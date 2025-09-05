const express = require('express');
const { db } = require('../../config/firebase');
const axios = require('axios'); // Import axios
const { FieldValue } = require('firebase-admin/firestore'); // Import FieldValue
const authMiddleware = require('../middleware/auth'); // Import the middleware

const router = express.Router();





// @route   GET api/reviews/heatmap
// @desc    Get all reviews for heatmap generation
// @access  Public
router.get('/heatmap', async (req, res) => {
    try {
        const reviewsRef = db.collection('reviews');
        const snapshot = await reviewsRef.get();

        if (snapshot.empty) {
            return res.json([]);
        }

        const heatmapData = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            // We only need the location and sentiment score for the heatmap
            if (data.location && typeof data.sentimentScore === 'number') {
                heatmapData.push({
                    lat: data.location.lat,
                    lng: data.location.lng,
                    sentimentScore: data.sentimentScore,
                });
            }
        });

        res.json(heatmapData);

    } catch (err) {
        console.error("Error fetching heatmap data:", err.message);
        res.status(500).send('Server Error');
    }
});







// @route   GET api/reviews/summary
// @desc    Get an AI-generated summary for a specific area
// @access  Public
router.get('/summary', async (req, res) => {
    try {
        const { lat, lng } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ msg: 'Latitude and Longitude query parameters are required.' });
        }
        
        // --- Step 1: Fetch all reviews for the area (re-using logic from Phase 4) ---
        const centerLat = parseFloat(lat);
        const centerLng = parseFloat(lng);
        const latOffset = 0.0045; // ~500 meters
        const lngOffset = 0.0045;
        
        const reviewsRef = db.collection('reviews');
        const snapshot = await reviewsRef
            .where('location.lat', '>=', centerLat - latOffset)
            .where('location.lat', '<=', centerLat + latOffset)
            .get();

        const reviewTexts = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.location.lng >= (centerLng - lngOffset) && data.location.lng <= (centerLng + lngOffset)) {
                // Combine the prompt and more info for better context
                reviewTexts.push(`${data.prompt}. ${data.moreInfo || ''}`);
            }
        });

        if (reviewTexts.length < 3) { // Don't generate summary for too few reviews
            return res.json({ summary: "Not enough reviews in this area to generate a safety summary." });
        }

        // --- Step 2: Call the Summarization Microservice ---
        const summaryResponse = await axios.post('http://127.0.0.1:8001/summarize', {
            reviews: reviewTexts
        });

        res.json({ summary: summaryResponse.data.summary });

    } catch (err) {
        console.error("Error generating summary:", err.message);
        // Don't send a server error, just a friendly message
        res.status(500).json({ summary: "Could not generate a summary at this time." });
    }
});








// @route   GET api/reviews
// @desc    Fetch reviews based on location
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
            .where('status', '==', 'approved') // <-- THE CRITICAL FILTER
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
// @desc    Submit a new safety review and analyze its sentiment
// @access  Public (for now)
router.post('/', authMiddleware,async (req, res) => {
    try {
        const { rating, prompt, moreInfo, location } = req.body;

        if (!rating || !prompt || !location || !location.lat || !location.lng) {
            return res.status(400).json({ msg: 'Please provide rating, prompt, and a valid location.' });
        }
        
        const textToAnalyze = `${prompt}. ${moreInfo}`; // Combine prompt and details for analysis



        // --- Step 1: Content Moderation ---
        let reviewStatus = 'approved'; // Default status
        try {
            const moderationResponse = await axios.post('http://127.0.0.1:8002/moderate', {
                text: textToAnalyze
            });
            if (moderationResponse.data && moderationResponse.data.is_toxic) {
                reviewStatus = 'pending_moderation';
                console.log(`Content flagged as toxic. Status set to: ${reviewStatus}`);
            }
        } catch (error) {
            console.error("Error calling moderation service:", error.message);
            // If the service is down, we approve by default to not block users.
        }
        // --- End of Moderation ---



        
        // --- Step 2: Sentiment Analysis (only if approved) ---
        let sentimentScore = 0;  // Default score
        if (reviewStatus === 'approved') {
            try {
                const sentimentResponse = await axios.post('http://127.0.0.1:8000/analyze', {
                    text: textToAnalyze
                });
                if (sentimentResponse.data && typeof sentimentResponse.data.score === 'number') {
                    sentimentScore = sentimentResponse.data.score;
                }
            } catch (error) {
                console.error("Error calling sentiment service:", error.message); // Don't block the review if the AI service is down. Just proceed with a neutral score.
            }
        }
        // --- End of Sentiment Analysis ---



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
            sentimentScore: sentimentScore, // Store the AI-generated score!
            status: reviewStatus, // Add the new status field!
            userId: req.user.uid // <-- ADD THIS LINE
        };
        
        const docRef = await db.collection('reviews').add(newReview);
        res.status(201).json({ id: docRef.id, ...newReview });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});









// @route   POST api/reviews/:id/vote
// @desc    Upvote or downvote a review
// @access  Private
router.post('/:id/vote', authMiddleware, async (req, res) => {
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const reviewId = req.params.id;
    const userId = req.user.uid;

    if (!['upvote', 'downvote'].includes(voteType)) {
        return res.status(400).json({ msg: 'Invalid vote type.' });
    }

    const reviewRef = db.collection('reviews').doc(reviewId);

    try {
        await db.runTransaction(async (transaction) => {
            const reviewDoc = await transaction.get(reviewRef);
            if (!reviewDoc.exists) {
                throw new Error('Review not found');
            }

            const data = reviewDoc.data();
            const upvotedBy = data.upvotedBy || [];
            const downvotedBy = data.downvotedBy || [];

            const isUpvoted = upvotedBy.includes(userId);
            const isDownvoted = downvotedBy.includes(userId);

            let updates = {};

            if (voteType === 'upvote') {
                if (isUpvoted) {
                    // User is undoing their upvote
                    updates.upvotedBy = FieldValue.arrayRemove(userId);
                } else {
                    // User is adding an upvote
                    updates.upvotedBy = FieldValue.arrayUnion(userId);
                    if (isDownvoted) {
                        // If they had previously downvoted, remove the downvote
                        updates.downvotedBy = FieldValue.arrayRemove(userId);
                    }
                }
            } else if (voteType === 'downvote') {
                if (isDownvoted) {
                    // User is undoing their downvote
                    updates.downvotedBy = FieldValue.arrayRemove(userId);
                } else {
                    // User is adding a downvote
                    updates.downvotedBy = FieldValue.arrayUnion(userId);
                    if (isUpvoted) {
                        // If they had previously upvoted, remove the upvote
                        updates.upvotedBy = FieldValue.arrayRemove(userId);
                    }
                }
            }
            transaction.update(reviewRef, updates);
        });

        res.json({ msg: 'Vote recorded successfully.' });
    } catch (error) {
        console.error('Vote transaction failed: ', error);
        res.status(500).json({ msg: error.message || 'Server Error' });
    }
});









// @route   GET api/reviews/my-reviews
// @desc    Get all reviews submitted by the logged-in user
// @access  Private
router.get('/my-reviews', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.uid; // Get user ID from the decoded token

        const reviewsRef = db.collection('reviews');
        const snapshot = await reviewsRef.where('userId', '==', userId).orderBy('createdAt', 'desc').get();

        if (snapshot.empty) {
            return res.json([]);
        }

        const userReviews = [];
        snapshot.forEach(doc => {
            userReviews.push({ id: doc.id, ...doc.data() });
        });

        res.json(userReviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;