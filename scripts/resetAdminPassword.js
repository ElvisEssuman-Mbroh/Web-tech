require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

async function resetAdminPassword() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        const admin = await User.findOne({ email: adminEmail });
        
        if (!admin) {
            console.log('No admin user found with email:', adminEmail);
            return;
        }

        // Reset password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        admin.password = hashedPassword;
        await admin.save();

        console.log('Admin password reset successfully for:', adminEmail);

    } catch (error) {
        console.error('Error resetting admin password:', error);
    } finally {
        await mongoose.disconnect();
    }
}

resetAdminPassword(); 