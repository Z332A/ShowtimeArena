// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Just pass the URI; no need for useNewUrlParser / useUnifiedTopology in Mongoose v6+
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit process if DB connection fails
  }
};

module.exports = connectDB;
