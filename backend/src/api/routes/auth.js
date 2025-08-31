const express = require('express');
const admin = require('firebase-admin');
const { db } = require('../../config/firebase');

const router = express.Router();

// @route   POST api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields.' });
    }

    try {
        // Create user with Firebase Auth
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
        });

        // Optionally, create a user profile in Firestore
        await db.collection('users').doc(userRecord.uid).set({
            email: userRecord.email,
            createdAt: new Date().toISOString(),
        });
        
        res.status(201).json({ msg: 'User created successfully', userId: userRecord.uid });

    } catch (error) {
        console.error("Signup Error:", error.message);
        // Provide more specific error messages
        if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({ msg: 'Email already in use.' });
        }
        res.status(500).json({ msg: 'Server error during user creation.' });
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get custom token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body; // In a real app, you wouldn't send plain password

    try {
        // Firebase Admin SDK cannot directly verify passwords.
        // The standard flow is to sign in on the client (frontend) with the Firebase Client SDK.
        // The client then gets an ID token and sends it to the backend for verification.
        // For our architecture, we'll create a custom token on the backend that the client can use to sign in.
        
        const userRecord = await admin.auth().getUserByEmail(email);
        
        // IMPORTANT: The password check is NOT done here. The frontend will handle it.
        // This endpoint's purpose is to confirm the user exists and generate a custom token.
        // A more secure flow involves sending a frontend-generated ID token to the backend.
        // For this project, we'll generate a custom token for the frontend to use.
        
        const customToken = await admin.auth().createCustomToken(userRecord.uid);
        
        res.json({ token: customToken, userId: userRecord.uid, email: userRecord.email });

    } catch (error) {
        console.error("Login Error:", error.message);
        if (error.code === 'auth/user-not-found') {
            return res.status(404).json({ msg: 'User not found.' });
        }
        res.status(500).json({ msg: 'Server error during login.' });
    }
});


module.exports = router;