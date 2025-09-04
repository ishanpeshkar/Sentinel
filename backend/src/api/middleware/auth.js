const admin = require('firebase-admin');

module.exports = async function(req, res, next) {
    // Get token from the header
    const authHeader = req.header('Authorization');

    // Check if not token
    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // The token is sent as "Bearer <token>"
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ msg: 'Token format is incorrect, authorization denied' });
        }

        // Verify token
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Add user payload to the request object
        next(); // Move to the next piece of middleware or the route handler
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};