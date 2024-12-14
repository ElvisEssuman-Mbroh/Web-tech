const mongoose = require('mongoose');
const Event = require('./models/eventModel'); // Adjust the path to your Event model

async function seedEvents() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/AcityEvents', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Define some sample events with categories
    const sampleEvents = [
      {
        name: 'Tech Workshop',
        description: 'Learn the latest trends in technology.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        time: '10:00 AM',
        location: 'Conference Hall A',
        capacity: 50,
        availableSeats: 50,
        categories: ['Workshops'], // Category: Workshops
      },
      {
        name: 'Business Seminar',
        description: 'Insights into the world of business.',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        time: '2:00 PM',
        location: 'Room 101',
        capacity: 30,
        availableSeats: 30,
        categories: ['Seminars'], // Category: Seminars
      },
      {
        name: 'Fitness Bootcamp',
        description: 'A day of physical and mental fitness.',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        time: '8:00 AM',
        location: 'Gymnasium',
        capacity: 20,
        availableSeats: 20,
        categories: ['Sports'], // Category: Sports
      },
      {
        name: 'Art & Creativity',
        description: 'Unleash your creative potential.',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        time: '4:00 PM',
        location: 'Art Center',
        capacity: 40,
        availableSeats: 40,
        categories: ['Club Activities'], // Category: Club Activities
      },
      {
        name: 'Sports Day',
        description: 'A day of fun and games.',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        time: '9:00 AM',
        location: 'Stadium',
        capacity: 100,
        availableSeats: 100,
        categories: ['Sports'], // Category: Sports
      },
      {
        name: 'Tech Conference',
        description: 'Discuss the future of technology with industry leaders.',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        time: '11:00 AM',
        location: 'Auditorium B',
        capacity: 80,
        availableSeats: 80,
        categories: ['Conferences'], // Category: Conferences
      },
    ];

    // Clear existing events
    await Event.deleteMany({});
    console.log('Existing events cleared.');

    // Insert sample events
    await Event.insertMany(sampleEvents);
    console.log('Sample events added successfully.');

    // Disconnect from the database
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding events:', error);
    mongoose.disconnect();
  }
}

seedEvents();
