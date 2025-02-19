// pages/calendar.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Calendar,
  dateFnsLocalizer,
  Views,
  // If you need more RBC exports, import them here
} from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';

import 'react-big-calendar/lib/css/react-big-calendar.css';

interface Booking {
  _id: string;
  customerName: string;
  startTime: string;  // e.g. "2025-02-10T10:00:00.000Z"
  endTime: string;    // e.g. "2025-02-10T12:00:00.000Z"
}

interface MyEvent {
  title: string;
  start: Date;
  end: Date;
}

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarPage() {
  const router = useRouter();
  const [events, setEvents] = useState<MyEvent[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/bookings');
        if (!res.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data: Booking[] = await res.json();

        // Transform bookings -> RBC events
        const bookedEvents: MyEvent[] = data.map((booking) => {
          const start = new Date(booking.startTime);
          const end = new Date(booking.endTime);

          // Title: Customer Name + Start-End Time
          const startStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const endStr = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const bookingTitle = `${booking.customerName}\n${startStr} - ${endStr}`;

          return {
            title: bookingTitle,
            start,
            end,
          };
        });
        setEvents(bookedEvents);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  // Style each event red with white text
  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: 'red',
        color: 'white',
      },
    };
  };

  /**
   * dayPropGetter is called for each date cell in the monthly view
   * Return a style if the date is in the past -> grey it out
   */
  const dayPropGetter = (date: Date) => {
    const now = new Date();
    // If date is before "today" (ignoring time), grey out
    const isPast = date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (isPast) {
      return {
        style: {
          backgroundColor: '#eee',
          color: '#999',
        },
      };
    }
    return {};
  };

  return (
    <div style={{ padding: '1rem' }}>
      {/* 
        A header row with a title on the left, 
        and a "Create Booking" button on the right
      */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
      }}>
        <h1>Monthly Bookings</h1>
        <button
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '0.6rem 1.2rem',
            cursor: 'pointer',
            borderRadius: '4px',
            fontSize: '1rem',
          }}
          onClick={() => router.push('/new-booking')}
        >
          Create Booking
        </button>
      </div>

      <p>Let us help you find the perfect date for your event</p>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.MONTH}
        views={{ month: true }}
        style={{ height: 700 }}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
      />
    </div>
  );
}
