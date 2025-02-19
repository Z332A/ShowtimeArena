// pages/invoice.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Table, Alert } from 'react-bootstrap';

interface Booking {
  _id: string;
  customerName: string;
  referenceCode?: string;
  email: string;
  startTime: string;      // e.g. "2025-02-01T10:00:00.000Z"
  endDate: string;        // e.g. "2025-02-03"
  status: string;         // e.g. "paid"
  priceBreakdown: {
    baseCost: number;
    mediaCost: number;
    ledCost: number;
    soundCost: number;
    drinkCost: number;
    streamingCost: number;
    subtotal: number;
    vat: number;
    total: number;
  };
  // Add any other fields you store, e.g. phoneNumber, hoursPerSession, etc.
}

export default function InvoicePage() {
  const router = useRouter();
  const { bookingId } = router.query; // e.g. /invoice?bookingId=someId

  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        // Adjust the endpoint as needed. For example:
        // GET /api/bookings/[id]
        // that returns a Booking object including the referenceCode
        const response = await fetch(`/api/bookings/${bookingId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch booking: ${response.statusText}`);
        }
        const data = await response.json();
        setBooking(data);
      } catch (err: any) {
        console.error(err);
        setError('Error loading invoice. Check console.');
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (!bookingId) {
    return <Container style={{ marginTop: '2rem' }}>Loading booking ID...</Container>;
  }

  return (
    <Container style={{ marginTop: '2rem', maxWidth: '800px' }}>
      <h1>Invoice</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {!error && !booking && <p>Loading invoice details...</p>}

      {booking && (
        <>
          <Alert variant="success">
            Thank you for your payment, <strong>{booking.customerName}</strong>!
          </Alert>

          <p>
            <strong>Reference Code:</strong> {booking.referenceCode || 'N/A'}
          </p>
          <p>
            <strong>Status:</strong> {booking.status}
          </p>

          {/* Display date/time info */}
          <p>
            <strong>Start Time:</strong> {new Date(booking.startTime).toLocaleString()}
          </p>
          <p>
            <strong>End Date:</strong> {booking.endDate}
          </p>

          {/* Summarize price breakdown */}
          <h4 className="mt-4">Payment Details</h4>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Description</th>
                <th className="text-end">Amount (NGN)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Base Cost</td>
                <td className="text-end">{booking.priceBreakdown.baseCost.toLocaleString()}</td>
              </tr>
              {booking.priceBreakdown.mediaCost > 0 && (
                <tr>
                  <td>Media Services</td>
                  <td className="text-end">{booking.priceBreakdown.mediaCost.toLocaleString()}</td>
                </tr>
              )}
              {booking.priceBreakdown.ledCost > 0 && (
                <tr>
                  <td>LED Screen</td>
                  <td className="text-end">{booking.priceBreakdown.ledCost.toLocaleString()}</td>
                </tr>
              )}
              {booking.priceBreakdown.soundCost > 0 && (
                <tr>
                  <td>Sound Equipment</td>
                  <td className="text-end">{booking.priceBreakdown.soundCost.toLocaleString()}</td>
                </tr>
              )}
              {booking.priceBreakdown.drinkCost > 0 && (
                <tr>
                  <td>Drinks Corkage</td>
                  <td className="text-end">{booking.priceBreakdown.drinkCost.toLocaleString()}</td>
                </tr>
              )}
              {booking.priceBreakdown.streamingCost > 0 && (
                <tr>
                  <td>Streaming Services</td>
                  <td className="text-end">
                    {booking.priceBreakdown.streamingCost.toLocaleString()}
                  </td>
                </tr>
              )}
              <tr>
                <td><strong>Subtotal</strong></td>
                <td className="text-end">
                  {booking.priceBreakdown.subtotal.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td><strong>VAT (7.5%)</strong></td>
                <td className="text-end">{booking.priceBreakdown.vat.toLocaleString()}</td>
              </tr>
              <tr>
                <td><strong>Total</strong></td>
                <td className="text-end">
                  {booking.priceBreakdown.total.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </Table>

          <p>
            We have also emailed a copy of this invoice to <strong>{booking.email}</strong>.
            Please keep your <strong>Reference Code</strong> for future reference.
          </p>

          <p className="mt-4">
            <strong>Thank you for choosing Showtime Arena!</strong>
          </p>
        </>
      )}
    </Container>
  );
}
