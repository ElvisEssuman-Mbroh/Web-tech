require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

async function forceSetAdminPassword() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        console.log('Finding admin user...');
        const admin = await User.findOne({ email: adminEmail });

        if (!admin) {
            console.log('No admin user found!');
            return;
        }

        console.log('Admin found, setting new password...');
        
        // Force set new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);
        
        // Update using findOneAndUpdate to bypass any middleware
        const updatedAdmin = await User.findOneAndUpdate(
            { email: adminEmail },
            { $set: { password: hashedPassword } },
            { new: true }
        );

        console.log('Password updated for admin:', {
            email: updatedAdmin.email,
            role: updatedAdmin.role,
            hasPassword: !!updatedAdmin.password
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

forceSetAdminPassword(); 