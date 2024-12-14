require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        console.log('Creating admin with email:', adminEmail);

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (existingAdmin) {
            console.log('Admin user already exists:', {
                email: existingAdmin.email,
                role: existingAdmin.role
            });
            return;
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const adminUser = new User({
            name: 'Admin User',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin user created successfully:', {
            email: adminUser.email,
            role: adminUser.role,
            id: adminUser._id
        });

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

createAdminUser(); 