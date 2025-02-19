// pages/payment.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { Container, Button } from 'react-bootstrap';

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const {
    customerName,
    amount,
    phoneNumber,
    email,
    startDate,
    endDate,
    startHour,
    startMinute,
    startPeriod,
    hoursPerSession,
    sessionsCount,
    wantMediaServices,
    needLEDScreen,
    needSoundEquipment,
    ownDrinks,
    requireStreaming,
    bookingId, // Add this if you store the booking in DB first
  } = router.query;

  // Extract first name from customerName
  const fullName = customerName ? customerName.toString() : 'Customer';
  const firstName = fullName.split(' ')[0];

  // Convert total from Naira to kobo for Paystack
  const totalAmount = amount ? Number(amount) : 0;
  const paystackAmount = totalAmount * 100; // in kobo

  const handlePaystackPayment = async () => {
    if (!paystackAmount) {
      alert('Invalid or missing amount.');
      return;
    }

    if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
      alert('Paystack public key not set in env.');
      return;
    }

    // @ts-ignore - Because Paystack inline script is loaded in _app.tsx via <Script />
    const paystackHandler = window.PaystackPop && window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: email || 'customer@example.com',
      amount: paystackAmount, // in kobo
      currency: 'NGN',
      // A unique reference for this transaction
      // Could be random, or e.g. "PS-" + new Date().getTime()
      ref: `PS-${new Date().getTime()}`,
      // Callback once payment is successful
      callback: async (response: any) => {
        // e.g. response.reference is the paystack transaction reference
        console.log('Paystack success:', response);
        alert('Payment complete! Reference: ' + response.reference);

        // 1) Verify the transaction on your server
        try {
          const verifyRes = await fetch('/api/paystack/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reference: response.reference,
              bookingId, // if your backend needs it to update the booking as paid
            }),
          });
          if (!verifyRes.ok) throw new Error('Verification failed');
          const verifyData = await verifyRes.json();

          // If verification succeeds, redirect to final invoice page
          router.push(`/invoice?bookingId=${bookingId || ''}`);
        } catch (err) {
          console.error('Error verifying payment:', err);
          alert('Error verifying payment. Please contact support.');
        }
      },
      onClose: () => {
        alert('Payment window closed.');
      },
    });

    if (paystackHandler) {
      paystackHandler.openIframe();
    } else {
      alert('Paystack script not loaded. Check your _app.tsx or script strategy.');
    }
  };

  const handleGoBack = () => {
    // Navigate back to New Booking page in Step 2 with all order details preserved.
    router.push({
      pathname: '/new-booking',
      query: {
        step: '2',
        customerName,
        phoneNumber,
        email,
        startDate,
        endDate,
        startHour,
        startMinute,
        startPeriod,
        hoursPerSession,
        sessionsCount,
        wantMediaServices,
        needLEDScreen,
        needSoundEquipment,
        ownDrinks,
        requireStreaming,
        amount,
        bookingId,
      },
    });
  };

  return (
    <Container className="my-5" style={{ maxWidth: '600px' }}>
      <h1>{`Hi, ${firstName}, Almost There!`}</h1>
      <p>
        Thank you for choosing Showtime Arena—where unforgettable moments come to life! 🌟
      </p>
      <p>You're just one step away from securing your spot!</p>
      <p>
        Please click the <strong>"Pay Now"</strong> button below to securely complete your payment
        through our trusted payment gateway. Once your payment is confirmed, your booking will
        be finalized and a confirmation email will be sent to you.
      </p>

      <h3>Amount Due: ₦{totalAmount.toLocaleString()}</h3>

      <Button
        variant="primary"
        className="w-100"
        onClick={handlePaystackPayment}
        style={{ marginBottom: '1rem' }}
      >
        Pay Now
      </Button>

      <p>
        If you have any questions or need assistance, please contact our support team at{' '}
        <a href="mailto:askshowtime@sffl.football">askshowtime@sffl.football</a> or call{' '}
        <a href="tel:+234-916-986-7335">+234-916-986-7335</a>.
      </p>
      <p>
        We appreciate your business and look forward to hosting your event at Showtime Arena!
      </p>

      <Button variant="secondary" className="mt-3 w-100" onClick={handleGoBack}>
        Go Back
      </Button>
    </Container>
  );
};

export default PaymentPage;
