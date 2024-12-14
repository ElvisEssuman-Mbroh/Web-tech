require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');

async function checkAdminUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const adminEmail = process.env.ADMIN_EMAIL;
        console.log('Checking for admin with email:', adminEmail);

        const admin = await User.findOne({ email: adminEmail });
        
        if (admin) {
            console.log('Admin user found:', {
                email: admin.email,
                role: admin.role,
                name: admin.name,
                id: admin._id
            });
        } else {
            console.log('No admin user found with email:', adminEmail);
        }

    } catch (error) {
        console.error('Error checking admin:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkAdminUser(); 