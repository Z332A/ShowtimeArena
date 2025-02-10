// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [date, setDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAvailableSlots = async (selectedDate) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings/available?date=${selectedDate}`);
      setAvailableSlots(res.data.availableSlots);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  };

  return (
    <div>
      <h2>Booking Dashboard</h2>
      <div>
        <h3>All Bookings</h3>
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
              <strong>{booking.customerName}</strong> from{" "}
              {new Date(booking.startTime).toLocaleString()} to{" "}
              {new Date(booking.endTime).toLocaleString()} - Status: {booking.status}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Check Available Slots</h3>
        <input 
          type="date" 
          value={date} 
          onChange={handleDateChange}
        />
        {availableSlots.length > 0 && (
          <div>
            <h4>Available Slots for {date}:</h4>
            <ul>
              {availableSlots.map((slot, idx) => (
                <li key={idx}>{new Date(slot).toLocaleTimeString()}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
