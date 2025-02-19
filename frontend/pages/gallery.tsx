// pages/gallery.tsx
import React, { useState } from 'react';
import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';

interface GalleryProps {
  images: string[];
}

const GalleryPage: React.FC<GalleryProps> = ({ images }) => {
  // Lightbox/slider state
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Open lightbox on a specific image
  const handleOpenLightbox = (index: number) => {
    setCurrentIndex(index);
    setShowLightbox(true);
  };

  // Close the lightbox
  const handleCloseLightbox = () => {
    setShowLightbox(false);
  };

  // Show the next image
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  // Show the previous image
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Container className="my-5">
      <h1>Gallery</h1>

      {/* Thumbnail Grid */}
      <Row>
        {images.map((filename, index) => (
          <Col key={filename} xs={12} sm={6} md={4} className="mb-4">
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '300px',
                cursor: 'pointer',
              }}
              onClick={() => handleOpenLightbox(index)}
            >
              <Image
                src={`/gallery/${filename}`}
                alt={filename}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </Col>
        ))}
      </Row>

      {/* Lightbox/Slider Modal */}
      <Modal
        show={showLightbox}
        onHide={handleCloseLightbox}
        centered
        // Make the modal auto-size to the image, up to the viewport
        dialogClassName="lightbox-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Image {currentIndex + 1} of {images.length}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* 
            Display the image at its natural size 
            but limit width/height to viewport (no sideways scroll).
          */}
          <div style={{ textAlign: 'center' }}>
            <Image
              src={`/gallery/${images[currentIndex]}`}
              alt={`Image ${currentIndex}`}
              // Provide minimal dimension; let style limit final size
              width={800}
              height={600}
              style={{
                maxWidth: '90vw',
                maxHeight: '80vh',
                width: 'auto',
                height: 'auto',
                display: 'inline-block',
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePrev}>
            Prev
          </Button>
          <Button variant="secondary" onClick={handleNext}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GalleryPage;

/**
 * Build-time gather images from /public/gallery (if any).
 * This runs once at build time, so adding images requires a rebuild
 * for them to appear in the gallery.
 */
export async function getStaticProps() {
  // Path to /public/gallery
  const galleryDir = path.join(process.cwd(), 'public', 'gallery');

  let filenames: string[] = [];
  try {
    filenames = fs.readdirSync(galleryDir);
  } catch (err) {
    console.error('Error reading gallery folder:', err);
  }

  // Filter for valid image extensions
  const validExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
  const imageFilenames = filenames.filter((file) =>
    validExtensions.includes(path.extname(file).toLowerCase())
  );

  return {
    props: {
      images: imageFilenames,
    },
  };
}
