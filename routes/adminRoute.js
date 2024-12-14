const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Admin login attempt for:', email);

        // Find user and check if they're an admin
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('No user found with email:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.role !== 'admin') {
            console.log('User found but not admin:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid password for:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Admin login successful for:', email);
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 