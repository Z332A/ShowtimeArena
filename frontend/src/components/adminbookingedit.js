// src/components/AdminBookingEdit.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminBookingEdit = ({ bookingId }) => {
  const [booking, setBooking] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/bookings`);
        const theBooking = res.data.find(b => b._id === bookingId);
        setBooking(theBooking);
        setStatus(theBooking?.status || '');
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5000/api/bookings/${bookingId}`, {
        status
      });
      alert('Booking status updated!');
      setBooking(res.data);
    } catch (err) {
      console.error(err);
      alert('Error updating booking');
    }
  };

  if (!booking) return <div>Loading...</div>;

  return (
    <div>
      <h4>Admin Edit Booking</h4>
      <p>Booking ID: {booking._id}</p>
      <p>Customer: {booking.customerName}</p>
      <p>Current Status: {booking.status}</p>
      <form onSubmit={handleSubmit}>
        <label>Update Status: </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default AdminBookingEdit;
