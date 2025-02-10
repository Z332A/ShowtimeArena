// src/App.js
import React from 'react';
import Dashboard from './components/dashboard';
import BookingForm from './components/bookingform';

const App = () => {
  return (
    <div>
      <h1>Event Center Booking App</h1>
      <BookingForm />
      <Dashboard />
    </div>
  );
};

export default App;
