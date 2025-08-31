const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { db } = require('./config/firebase'); // Initialize Firebase
const reviewRoutes = require('./api/routes/reviews');
const authRoutes = require('./api/routes/auth'); // Import auth routes

const app = express();

// Middleware
app.use(cors()); // Allow requests from our frontend
app.use(express.json()); // To parse JSON request bodies

// API Routes
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes); // Use auth routes

app.get('/', (req, res) => {
    res.send('Sentinel Backend is running!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});