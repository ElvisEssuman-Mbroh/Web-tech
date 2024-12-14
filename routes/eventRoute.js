const express = require('express');
const Event = require('../models/eventModel');
const User = require('../models/userModel');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const mongoose = require('mongoose');

const router = express.Router();

// 1. Specific GET routes first
router.get('/my-events', auth, async (req, res) => {
  console.log('Fetching my events for user:', req.userId); // Debug log
  
  try {
    const user = await User.findById(req.userId).populate('rsvpedEvents');
    console.log('User found:', !!user); // Debug log
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    console.log('RSVPed events:', user.rsvpedEvents.length); // Debug log
    res.status(200).json(user.rsvpedEvents);
  } catch (error) {
    console.error('Error fetching RSVPed events:', error);
    res.status(500).json({ error: 'Server error. Could not fetch RSVPed events.' });
  }
});

router.get('/for-you', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Fetch events that match user's preferences
    const events = await Event.find({
      date: { $gte: new Date() },
      categories: { $in: user.preferences }, // Match user preferences
    }).sort('date');

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events for you:', error.message);
    res.status(500).json({ error: 'Server error. Could not fetch events for you.' });
  }
});

// 2. POST routes for specific actions
router.post('/rsvp/:eventId', auth, async (req, res) => {
    const { eventId } = req.params;
    console.log('RSVP attempt:', { eventId, userId: req.userId });

    try {
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ error: 'Invalid event ID' });
        }

        // Find the event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if event has available seats
        if (event.availableSeats <= 0) {
            return res.status(400).json({ error: 'No seats available' });
        }

        // Find the user
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if user already booked this event
        if (user.rsvpedEvents && user.rsvpedEvents.includes(eventId)) {
            return res.status(400).json({ error: 'You have already booked this event' });
        }

        // Initialize rsvpedEvents array if it doesn't exist
        if (!user.rsvpedEvents) {
            user.rsvpedEvents = [];
        }

        // Update event and user
        event.availableSeats -= 1;
        user.rsvpedEvents.push(eventId);

        // Save both documents
        await Promise.all([
            event.save(),
            user.save()
        ]);

        res.status(200).json({
            message: 'Event booked successfully',
            availableSeats: event.availableSeats
        });

    } catch (error) {
        console.error('RSVP Error:', error);
        res.status(500).json({ error: 'Server error. Could not RSVP.' });
    }
});

router.post('/remove-rsvp/:eventId', auth, async (req, res) => {
    const { eventId } = req.params;
  
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found.' });
      }
  
      const user = await User.findById(req.userId); // Assuming `req.userId` is set in `authenticateToken`
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      if (!user.rsvpedEvents.includes(eventId)) {
        return res.status(400).json({ error: 'You have not RSVPed for this event.' });
      }
  
      // Update event and user
      event.availableSeats += 1; // Increase available seats
      event.attendees = event.attendees.filter(attendeeId => attendeeId.toString() !== user._id.toString());
      await event.save();
  
      user.rsvpedEvents = user.rsvpedEvents.filter(rsvpId => rsvpId.toString() !== eventId);
      await user.save();
  
      res.status(200).json({ message: 'RSVP removed successfully.', event });
    } catch (error) {
      console.error('Error removing RSVP:', error.message);
      res.status(500).json({ error: 'Server error. Could not remove RSVP.' });
    }
  });
  

// 3. Admin routes for event management
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  console.log('Create event request:', req.body);
  const { name, description, date, time, location, capacity, categories } = req.body;

  if (!name || !description || !date || !time || !location || !capacity) {
    return res.status(400).json({ error: 'All fields (name, description, date, time, location, capacity) are required.' });
  }

  try {
    const event = new Event({
      name,
      description,
      date,
      time,
      location,
      capacity,
      availableSeats: capacity,
      categories: categories || [],
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    const newEvent = await event.save();
    console.log('Event created:', newEvent);
    res.status(201).json({ message: 'Event created successfully.', event: newEvent });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Server error. Could not create the event.' });
  }
});

router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
  console.log('Update event request:', req.body);
  
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update only the fields that are provided
    const updateFields = {};
    const allowedFields = ['name', 'description', 'date', 'time', 'location', 'capacity', 'categories'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    // Handle image update
    if (req.file) {
      updateFields.imageUrl = `/uploads/${req.file.filename}`;
    }

    // If capacity is being updated, adjust availableSeats
    if (updateFields.capacity !== undefined) {
      const seatsDifference = updateFields.capacity - event.capacity;
      updateFields.availableSeats = event.availableSeats + seatsDifference;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id, 
      updateFields,
      { new: true, runValidators: true }
    );

    console.log('Event updated:', updatedEvent);
    res.json(updatedEvent);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. General routes with ID parameter
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Error fetching event details' });
  }
});

// 5. General GET route last
router.get('/', auth, async (req, res) => {
  try {
    // Allow admin to see all events
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
});

module.exports = router;
