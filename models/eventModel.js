const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  availableSeats: { type: Number },
  categories: [String],
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
