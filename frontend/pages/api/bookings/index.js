// pages/api/bookings/index.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import connectDB from '../../../lib/db';
import Booking from 'models/Booking';

export default async function handler(req, res) {
  // Ensure DB is connected for both GET/POST
  await connectDB();

  if (req.method === 'GET') {
    // Return real bookings from the DB
    try {
      // If you want all bookings:
      const bookings = await Booking.find();
      // OR if you want only the logged-in user's bookings:
      // const session = await getServerSession(req, res, authOptions);
      // if (!session?.user) {
      //   return res.status(401).json({ message: 'Unauthorized' });
      // }
      // const bookings = await Booking.find({ userId: session.user.id });

      return res.status(200).json(bookings);
    } catch (error) {
      console.error('GET /bookings error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }

  } else if (req.method === 'POST') {
    // Create a new booking, using NextAuth for user data
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Extract user from session
      const userId = session.user.id;
      const userEmail = session.user.email;
      const userPhone = session.user.phone || '';

      // Extract booking data from request body
      const {
        customerName,
        contact,
        startTime,
        endTime,
        numberOfSessions,
      } = req.body;

      // Create the booking doc
      const newBooking = await Booking.create({
        // Existing fields in your Booking schema
        customerName: customerName || session.user.name || 'Guest',
        contact: contact || userPhone,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        numberOfSessions: numberOfSessions ?? 1,

        // Optionally store user info
        userId,
        userEmail,
        userPhone,
      });

      return res.status(201).json({
        message: 'Booking created successfully',
        booking: newBooking,
      });
    } catch (error) {
      console.error('POST /bookings error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }

  } else {
    // Unsupported method
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
