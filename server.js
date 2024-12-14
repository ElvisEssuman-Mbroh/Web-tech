require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Add this line near your other middleware configurations
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Add this line after your other middleware configurations
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/AcityEvents')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Import Routes
const userRoutes = require('./routes/userRoute');
const eventRoutes = require('./routes/eventRoute');
const adminRoutes = require('./routes/adminRoute');

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
