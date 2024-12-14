require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

async function verifyAdminPassword() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        console.log('Verifying admin credentials for:', adminEmail);

        const admin = await User.findOne({ email: adminEmail });
        
        if (!admin) {
            console.log('No admin user found');
            return;
        }

        console.log('Admin user found:', {
            email: admin.email,
            role: admin.role,
            hasPassword: !!admin.password
        });

        // Test password
        const isMatch = await bcrypt.compare(adminPassword, admin.password);
        console.log('Password match result:', isMatch);

    } catch (error) {
        console.error('Error verifying admin password:', error);
    } finally {
        await mongoose.disconnect();
    }
}

verifyAdminPassword(); 