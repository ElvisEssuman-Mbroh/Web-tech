const Event = require('../models/eventModel');
const User = require('../models/userModel');

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort('date'); // Fetch events sorted by date
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Create an event (admin only)
exports.createEvent = async (req, res) => {
  const { name, date, time, location, description, capacity, categories } = req.body;

  // Validate required fields
  if (!name || !date || !time || !location || !description || !capacity || !categories) {
    return res.status(400).json({ error: 'All fields (name, date, time, location, description, capacity, categories) are required' });
  }

  // Validate categories
  const validCategories = ['Workshops', 'Seminars', 'Club Activities', 'Sports', 'Conferences'];
  const invalidCategories = categories.filter(category => !validCategories.includes(category));

  if (invalidCategories.length > 0) {
    return res.status(400).json({ error: `Invalid categories: ${invalidCategories.join(', ')}` });
  }

  try {
    const event = new Event({
      name,
      date,
      time,
      location,
      description,
      capacity,
      availableSeats: capacity,
      categories,
    });

    await event.save();
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('Error creating event:', error.message);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// RSVP to an event
exports.rsvpEvent = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.userId; // Assuming `req.userId` is set by authentication middleware

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.availableSeats <= 0) {
      return res.status(400).json({ error: 'No seats available for this event' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.rsvpedEvents.includes(eventId)) {
      return res.status(400).json({ error: 'You have already RSVPed for this event' });
    }

    // Update event and user
    event.availableSeats -= 1;
    event.attendees.push(userId);
    await event.save();

    user.rsvpedEvents.push(eventId);
    await user.save();

    res.status(200).json({ message: 'RSVP successful', event });
  } catch (error) {
    console.error('Error RSVPing to event:', error.message);
    res.status(500).json({ error: 'Failed to RSVP to event' });
  }
};

// Get events matching user preferences (For You)
exports.getForYouEvents = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const events = await Event.find({
      date: { $gte: new Date() },
      categories: { $in: user.preferences },
    }).sort('date');

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching "For You" events:', error.message);
    res.status(500).json({ error: 'Failed to fetch "For You" events' });
  }
};

// Get RSVPed events for a user
exports.getMyEvents = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).populate('rsvpedEvents');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.rsvpedEvents);
  } catch (error) {
    console.error('Error fetching RSVPed events:', error.message);
    res.status(500).json({ error: 'Failed to fetch RSVPed events' });
  }
};

// Get all events with RSVP status
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ date: { $gte: new Date() } }).sort('date');
    const user = await User.findById(req.userId); // Assuming req.userId is set in authenticateToken

    const eventsWithRSVPStatus = events.map((event) => {
      return {
        ...event.toObject(),
        isRSVPed: user.rsvpedEvents.includes(event._id.toString()), // Check if user has RSVP'd
      };
    });

    res.json(eventsWithRSVPStatus);
  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.status(500).json({ error: 'Server error. Could not fetch events.' });
  }
};
