// routes/booking.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// POST /api/bookings
router.post('/', async (req, res) => {
  try {
    // Destructure the fields sent from the frontend
    const {
      customerName,
      phoneNumber,
      email,
      startTime,        // Should be a valid Date string
      endDate,          // Should be a valid Date string
      hoursPerSession,
      sessionsCount,
      wantMediaServices,
      needLEDScreen,
      needSoundEquipment,
      ownDrinks,
      requireStreaming,
      priceBreakdown,
    } = req.body;

    // Optional: Validate required fields
    if (
      !customerName ||
      !phoneNumber ||
      !email ||
      !startTime ||
      !endDate ||
      !hoursPerSession ||
      !sessionsCount ||
      !priceBreakdown
    ) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Create a new booking document using the fields from the frontend.
    const newBooking = new Booking({
      customerName,
      phoneNumber,
      email,
      startTime,         // Frontend should send a proper Date string
      endDate,           // Frontend should send a proper Date string
      hoursPerSession,
      sessionsCount,
      wantMediaServices,
      needLEDScreen,
      needSoundEquipment,
      ownDrinks,
      requireStreaming,
      priceBreakdown,
    });

    const savedBooking = await newBooking.save();
    return res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ error: 'Server Error' });
  }
});

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    return res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ error: 'Server Error' });
  }
});

// GET available slots (unchanged or update as needed)
router.get('/available', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required.' });
    }

    // Define the start and end of the day
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      startTime: { $lte: dayEnd },
      endDate: { $gte: dayStart },
    });

    // Generate all 30-minute intervals for the day
    let intervals = [];
    let current = new Date(dayStart);
    while (current < dayEnd) {
      intervals.push(new Date(current));
      current = new Date(current.getTime() + 30 * 60 * 1000);
    }

    // Filter intervals that overlap with existing bookings
    intervals = intervals.filter(timeSlot => {
      return !bookings.some(booking => {
        return timeSlot >= booking.startTime && timeSlot < booking.endDate;
      });
    });

    return res.json({ availableSlots: intervals });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return res.status(500).json({ error: 'Server Error' });
  }
});

// Optionally add PUT (update) and DELETE endpoints as needed.

module.exports = router;
