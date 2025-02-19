// pages/booking.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Booking } from '../types/Booking'; // Ensure the path and casing are correct

const BookingPage: React.FC = () => {
  // Use Booking[] instead of any[]
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get<Booking[]>('https://showtime-arena.onrender.com/api/bookings');
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <h1>All Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul>
          {bookings.map((b) => (
            <li key={b._id} style={{ marginBottom: '1.5rem' }}>
              <strong>{b.customerName}</strong>
              <br />
              Contact: {b.contact}
              <br />
              From: {new Date(b.startTime).toLocaleString()}
              <br />
              To: {new Date(b.endTime).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingPage;
