// src/components/BookingForm.js
import React, { useState } from 'react';
import axios from 'axios';

const BookingForm = () => {
  const [customerName, setCustomerName] = useState('');
  const [contact, setContact] = useState('');
  const [startTime, setStartTime] = useState('');
  const [numberOfSessions, setNumberOfSessions] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/bookings', {
        customerName,
        contact,
        startTime,
        numberOfSessions,
      });
      alert('Booking created!');
    } catch (err) {
      console.error(err);
      alert('Error creating booking');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create a New Booking</h3>
      <div>
        <label>Customer Name: </label>
        <input 
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Contact: </label>
        <input 
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Start Time: </label>
        <input 
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Number of 30-min Sessions: </label>
        <input 
          type="number"
          value={numberOfSessions}
          onChange={(e) => setNumberOfSessions(e.target.value)}
          min="1"
          required
        />
      </div>
      <button type="submit">Create Booking</button>
    </form>
  );
};

export default BookingForm;
