'use client';

import { useState } from 'react';
import styles from '../app/properties/[id]/page.module.css';

export default function MediaGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  let parsedImages = [];
  try {
    parsedImages = typeof images === 'string' ? JSON.parse(images) : images;
  } catch(e) {}
  if (!Array.isArray(parsedImages)) parsedImages = [];

  const displayImages = parsedImages.length > 0 
    ? parsedImages 
    : ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'];

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <>
      {/* Editorial Main Gallery Display */}
      <section className={styles.gallerySection}>
        <div 
          style={{ 
            position: 'relative',
            width: '100%',
            maxWidth: '1100px',
            height: 'min(60vh, 520px)',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#0C241C',
            boxShadow: '0 12px 35px rgba(18, 49, 40, 0.15)',
            border: '1px solid rgba(18, 49, 40, 0.15)',
            backgroundImage: `url(${displayImages[currentIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setIsFullscreen(true)}
        >
          {displayImages.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                style={{ 
                  position: 'absolute', 
                  left: '15px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'rgba(12, 36, 28, 0.75)', 
                  color: '#F7F4EC', 
                  border: '1px solid rgba(201, 162, 78, 0.4)', 
                  width: '42px', 
                  height: '42px', 
                  cursor: 'pointer', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '1rem',
                  transition: 'all 0.2s ease'
                }}
                aria-label="Previous photo"
              >❮</button>
              
              <button 
                onClick={nextImage}
                style={{ 
                  position: 'absolute', 
                  right: '15px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'rgba(12, 36, 28, 0.75)', 
                  color: '#F7F4EC', 
                  border: '1px solid rgba(201, 162, 78, 0.4)', 
                  width: '42px', 
                  height: '42px', 
                  cursor: 'pointer', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '1rem',
                  transition: 'all 0.2s ease'
                }}
                aria-label="Next photo"
              >❯</button>
            </>
          )}

          <div style={{ 
            position: 'absolute', 
            bottom: '15px', 
            right: '15px', 
            background: 'rgba(12, 36, 28, 0.85)', 
            color: '#F7F4EC', 
            padding: '6px 14px', 
            borderRadius: '20px', 
            fontSize: '0.8rem', 
            fontWeight: 600, 
            border: '1px solid rgba(201, 162, 78, 0.4)',
            letterSpacing: '0.5px'
          }}>
            {currentIndex + 1} / {displayImages.length} ⤢
          </div>
        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(12, 36, 28, 0.96)', 
          zIndex: 9999, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <button 
            onClick={() => setIsFullscreen(false)} 
            style={{ 
              position: 'absolute', 
              top: '24px', 
              right: '28px', 
              background: 'none', 
              border: 'none', 
              color: '#F7F4EC', 
              fontSize: '2rem', 
              cursor: 'pointer', 
              zIndex: 10000 
            }}
            aria-label="Close fullscreen gallery"
          >✕</button>
          
          <div style={{ position: 'relative', width: '90%', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={displayImages[currentIndex]} 
              alt="Property Fullscreen" 
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px' }} 
            />
            {displayImages.length > 1 && (
              <>
                <button onClick={prevImage} style={{ position: 'absolute', left: '10px', background: 'rgba(18, 49, 40, 0.7)', color: 'white', border: '1px solid rgba(201,162,78,0.4)', padding: '1rem', fontSize: '1.2rem', cursor: 'pointer', borderRadius: '50%' }}>❮</button>
                <button onClick={nextImage} style={{ position: 'absolute', right: '10px', background: 'rgba(18, 49, 40, 0.7)', color: 'white', border: '1px solid rgba(201,162,78,0.4)', padding: '1rem', fontSize: '1.2rem', cursor: 'pointer', borderRadius: '50%' }}>❯</button>
              </>
            )}
          </div>
          
          <div style={{ color: '#F7F4EC', marginTop: '1rem', fontSize: '0.95rem', letterSpacing: '1px' }}>
            {currentIndex + 1} of {displayImages.length}
          </div>
        </div>
      )}
    </>
  );
}
