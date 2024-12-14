require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect('mongodb+srv://elvisessumanmbroh:oVpgCst1tceIc8Jm@cluster0.kxus3.mongodb.net/your_database_name?retryWrites=true&w=majority');
        console.log('Connected to MongoDB');
        
        // Hardcoded admin credentials
        const adminEmail = "essuman@admin.com";
        const adminPassword = "admin123";

        // Delete existing admin if any
        await User.deleteOne({ email: adminEmail });
        console.log('Cleaned up any existing admin');

        // Hash password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        console.log('Password hashed');

        // Create new admin
        const adminUser = new User({
            name: 'Admin User',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin created successfully:', {
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