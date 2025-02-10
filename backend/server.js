// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const bookingRoutes = require('./routes/booking');

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Mount booking routes BEFORE starting the server
app.use('/api/bookings', bookingRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Event Center Booking API is running...');
});

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection promise rejected:', err);
  });
