const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', email); // Debug log
        
        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            console.log('Admin not found'); // Debug log
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            console.log('Invalid password'); // Debug log
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token with explicit role
        const token = jwt.sign(
            { 
                id: admin._id, 
                email: admin.email,
                role: 'admin' // Explicitly include admin role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Login successful, token generated'); // Debug log
        res.json({ token });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 