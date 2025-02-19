// pages/index.tsx
import React from 'react';
import Image from 'next/image';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';

const HomePage: React.FC = () => {
  const router = useRouter();

  // Example list of images to showcase the pitch
  const pitchImages = [
    '/images/pitch1.jpg',
    '/images/pitch2.jpg',
    '/images/pitch3.jpg',
    '/images/pitch4.jpg',
    '/images/pitch5.jpg',
    '/images/pitch6.jpg',
  ];

  return (
    <Container className="my-5">
      <Row className="align-items-center mb-5">
        <Col md={6}>
          <h1>Welcome to Showtime Arena</h1>
          <p>
            Manage your bookings efficiently with our easy-to-use platform. 
            Whether you are scheduling sessions or reviewing past bookings, we've got you covered.
          </p>
          {/* Buttons: Create Booking & View Available Slots */}
          <div className="d-flex gap-3 mt-3">
            <Link href="/new-booking" passHref>
              <Button variant="primary" size="lg">Create a Booking</Button>
            </Link>
            <Button
              variant="success"
              size="lg"
              onClick={() => router.push('/calendar')}
            >
              View Available Slots
            </Button>
          </div>
        </Col>
        <Col md={6}>
          <Image 
            src="/booking-illustration.svg"
            alt="Booking Illustration"
            width={500}
            height={300}
            className="img-fluid"
          />
        </Col>
      </Row>
      
      {/* How It Works Section */}
      <Row className="mt-5">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>How It Works</Card.Title>
              <div>
                <ol>
                  <li>Create a new booking using the form.</li>
                  <li>View all your bookings in one place.</li>
                  <li>Manage and update your bookings as needed.</li>
                </ol>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pitch Image Gallery */}
      <Row className="mt-5">
        <Col>
          <h2>At Showtime Arena, Quality is Everything!</h2>
          <p>
            Take a look at the state-of-the-art facilities and equipment lineup we offer. Our pitch is perfect for tournaments, 
            training sessions, and unforgettable events. Visit our gallery for more.
          </p>
        </Col>
      </Row>
      <Row>
        {pitchImages.map((src, idx) => (
          <Col md={4} key={idx} className="mb-4">
            <Image
              src={src}
              alt={`Pitch Image ${idx + 1}`}
              width={400}
              height={250}
              style={{ objectFit: 'cover' }}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HomePage;
