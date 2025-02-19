// pages/view-booking.tsx
import React, { useState } from 'react';
import axios from 'axios';

const ViewBookingPage: React.FC = () => {
  const [refCode, setRefCode] = useState('');
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      setError(null);
      setMessage(null);
      // Hit your endpoint that fetches a booking by reference code
      const res = await axios.get(`/api/bookings/ref/${refCode}`);
      if (res.status === 200 && res.data) {
        setBooking(res.data);
      } else {
        setBooking(null);
        setError('Booking not found for that reference code.');
      }
    } catch (err) {
      console.error(err);
      setBooking(null);
      setError('Error fetching booking. Check console.');
    }
  };

  const canCancel = (start: string): boolean => {
    // If start is at least 48 hours in the future
    const startDate = new Date(start);
    const now = new Date();
    const diffHours = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours >= 48; // 2 working days
  };

  const handleCancel = async () => {
    if (!booking) return;
    try {
      // Suppose your API route to cancel is /api/bookings/{id}/cancel
      const bookingId = booking._id;
      const res = await axios.put(`/api/bookings/${bookingId}/cancel`);
      if (res.status === 200) {
        setMessage('Booking cancelled. Please pick another date if needed.');
        setBooking({ ...booking, status: 'Cancelled' });
      } else {
        setError('Failed to cancel booking.');
      }
    } catch (err) {
      console.error(err);
      setError('Error cancelling booking.');
    }
  };

  const handleModify = () => {
    // Possibly redirect to a modify form, or open a modal
    if (!booking) return;
    // For example:
    window.location.href = `/new-booking?modifyId=${booking._id}`;
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '1rem' }}>
      <h1>View Booking</h1>
      <div style={{ marginBottom: '1rem' }}>
        <label>Enter Reference Code:</label>
        <input
          type="text"
          value={refCode}
          onChange={(e) => setRefCode(e.target.value.toUpperCase())}
          style={{ marginLeft: '1rem' }}
        />
        <button onClick={handleSearch} style={{ marginLeft: '1rem' }}>
          Search
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {booking && (
        <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
          <h2>Booking Details</h2>
          <p><strong>Reference Code:</strong> {booking.referenceCode}</p>
          <p><strong>Customer Name:</strong> {booking.customerName}</p>
          <p>
            <strong>Start Time:</strong>{' '}
            {new Date(booking.startTime).toLocaleString()}
          </p>
          <p>
            <strong>End Time:</strong>{' '}
            {new Date(booking.endTime).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {booking.status || 'Active'}
          </p>

          {/* Only allow cancellation if booking is at least 48 hours away */}
          {canCancel(booking.startTime) ? (
            <button onClick={handleCancel} style={{ marginRight: '1rem' }}>
              Cancel Booking
            </button>
          ) : (
            <p style={{ color: 'red' }}>
              Cancellation not possible if less than 2 days to booking.
            </p>
          )}

          {/* Possibly allow modification if not cancelled */}
          {booking.status !== 'Cancelled' && (
            <button onClick={handleModify}>Modify Booking</button>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewBookingPage;
