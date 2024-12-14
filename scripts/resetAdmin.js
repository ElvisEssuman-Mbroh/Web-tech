require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

async function resetAdmin() {
    try {
        // Connect to MongoDB
        console.log('Connecting to database...');
        await mongoose.connect('mongodb+srv://elvisessumanmbroh:oVpgCst1tceIc8Jm@cluster0.kxus3.mongodb.net/AcityEvents?retryWrites=true&w=majority');
        console.log('Connected to database');

        // Delete all existing admin users
        console.log('Deleting existing admin users...');
        await User.deleteMany({ role: 'admin' });
        console.log('Existing admin users deleted');

        // Create new admin user with fixed credentials
        const adminData = {
            name: 'Admin',
            email: 'admin@test.com',
            password: 'admin123',
            role: 'admin'
        };

        console.log('Creating new admin user with:', {
            email: adminData.email,
            password: adminData.password
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        // Create and save admin user
        const admin = new User({
            name: adminData.name,
            email: adminData.email,
            password: hashedPassword,
            role: adminData.role
        });

        await admin.save();
        console.log('Admin user created successfully');

        // Verify the admin user was created
        const createdAdmin = await User.findOne({ email: adminData.email });
        console.log('Created admin details:', {
            id: createdAdmin._id,
            email: createdAdmin.email,
            role: createdAdmin.role,
            hasPassword: !!createdAdmin.password
        });

        // Test password verification
        const passwordMatch = await bcrypt.compare(adminData.password, createdAdmin.password);
        console.log('Password verification test:', passwordMatch ? 'PASSED' : 'FAILED');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from database');
    }
}

resetAdmin(); 