const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Admin login attempt:', { email, passwordLength: password?.length });

        // Find user and check if they're an admin
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('Login failed: No user found with email:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('User found:', {
            email: user.email,
            role: user.role,
            hasPassword: !!user.password
        });

        if (user.role !== 'admin') {
            console.log('Login failed: User is not an admin:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isMatch);

        if (!isMatch) {
            console.log('Login failed: Invalid password for:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Admin login successful:', email);
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