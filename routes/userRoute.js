const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, preferences } = req.body;
  console.log('Registration attempt for:', email); // Debug log

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user (let the schema middleware handle password hashing)
    const user = new User({ 
      name, 
      email, 
      password, // Don't hash here - let the schema middleware do it
      preferences: preferences || [] 
    });

    await user.save();
    console.log('User registered successfully:', email);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ error: 'Registration failed. ' + err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for:', email); // Debug log

  try {
    // Validate input
    if (!email || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    console.log('User found:', !!user); // Debug log (don't log full user for security)

    if (!user) {
      console.log('No user found with email:', email);
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Log password lengths for debugging (don't log actual passwords)
    console.log('Password lengths - Input:', password.length, 'Stored:', user.password.length);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch); // Debug log

    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        role: user.role
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Login successful for:', email);
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
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// View user profile
router.get('/profile', auth, async (req, res) => {
  try {
    // Populate the rsvpedEvents field when fetching user
    const user = await User.findById(req.userId).populate('rsvpedEvents');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send back more complete user data
    res.json({
      name: user.name,
      email: user.email,
      preferences: user.preferences,
      rsvpedEvents: user.rsvpedEvents, // Include RSVPed events
      role: user.role
    });
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile details
router.put('/profile', auth, async (req, res) => {
  const { name, email, preferences } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (preferences) user.preferences = preferences;

    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user password
router.put('/profile/password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's RSVPed events
router.get('/my-events', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('rsvpedEvents');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.rsvpedEvents);
  } catch (error) {
    console.error('Error fetching RSVPed events:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
