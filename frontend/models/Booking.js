// models/Booking.js
const mongoose = require('mongoose');

/**
 * Updated BookingSchema:
 * - Preserves existing fields: customerName, contact, startTime, endTime, numberOfSessions, status
 * - Adds optional userId, userEmail, userPhone for integrated user accounts
 */
const BookingSchema = new mongoose.Schema({
  // Old/existing fields
  customerName: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  numberOfSessions: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  status: {
    type: String,
    required: true,
    default: 'Pending',
  },

  // New user-related fields for integrated logins
  userId: {
    // If you store user ID as a string from NextAuth session token
    // or if you want a direct Mongoose ObjectId, do:
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'User',
    type: String,
    required: false,
  },
  userEmail: {
    type: String,
    required: false,
  },
  userPhone: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('Booking', BookingSchema);
