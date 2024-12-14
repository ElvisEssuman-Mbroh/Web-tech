require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin');

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI );
        
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'elviss@admin.com' });
        if (existingAdmin) {
            console.log('Admin already exists');
            return;
        }

        // Create new admin
        const hashedPassword = await bcrypt.hash('admin123', 10);
        console.log(hashedPassword);
        const admin = new Admin({
            email: 'elvis@admin.com',
            password: hashedPassword
        });

        await admin.save();
        console.log('Admin seeded successfully');
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        mongoose.disconnect();
    }
}

seedAdmin();
