const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            req.userId = null;  // No token means no user ID
            return next();  // Continue without authentication
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check for either userId (regular users) or id (admin)
        const userId = decoded.userId || decoded.id;
        if (!userId) {
            return res.status(401).json({ message: 'Invalid token structure' });
        }

        req.userId = userId;  // Store the userId
        req.user = decoded;  // Store the full decoded token
        console.log('Auth middleware - userId set:', req.userId); // Debug log
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

const adminAuth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        console.log('Admin Auth - Header:', authHeader); // Debug log

        if (!authHeader) {
            return res.status(401).json({ message: 'No authorization header' });
        }

        const token = authHeader.replace('Bearer ', '');
        console.log('Admin Auth - Token:', token); // Debug log

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Admin Auth - Decoded:', decoded); // Debug log

        if (decoded.role !== 'admin') {
            console.log('Not admin role:', decoded.role); // Debug log
            return res.status(403).json({ message: 'Admin access required' });
        }

        req.userId = decoded.id;
        req.user = decoded; // Include full decoded token
        next();
    } catch (error) {
        console.error('Admin Auth error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = { auth, adminAuth };
