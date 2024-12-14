require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');

async function seedAdmin() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect('mongodb+srv://elvisessumanmbroh:oVpgCst1tceIc8Jm@cluster0.kxus3.mongodb.net/AcityEvents?retryWrites=true&w=majority');
        console.log('Connected successfully');

        // Delete any existing admin
        await User.deleteMany({ role: 'admin' });
        console.log('Cleared existing admins');

        // Create new admin with fixed credentials
        const adminData = {
            name: 'System Admin',
            email: 'admin@test.com',
            password: 'admin123',
            role: 'admin'
        };

        // Hash password once
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        // Use updateOne to bypass the pre-save middleware
        await User.updateOne(
            { email: adminData.email },
            {
                $set: {
                    name: adminData.name,
                    email: adminData.email,
                    password: hashedPassword,
                    role: adminData.role
                }
            },
            { upsert: true }
        );

        console.log('Admin created successfully');

        // Verify the password works
        const savedAdmin = await User.findOne({ email: adminData.email });
        console.log('Admin details:', {
            name: savedAdmin.name,
            email: savedAdmin.email,
            role: savedAdmin.role,
            id: savedAdmin._id
        });

        // Test login
        const passwordValid = await bcrypt.compare(adminData.password, savedAdmin.password);
        console.log('Password verification:', passwordValid ? 'SUCCESS' : 'FAILED');
        
        if (passwordValid) {
            console.log('\nYou can now log in with:');
            console.log('Email:', adminData.email);
            console.log('Password:', adminData.password);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seedAdmin();
