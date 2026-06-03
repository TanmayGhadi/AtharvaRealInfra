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

  const displayImages = parsedImages.length > 0 ? parsedImages : ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'];

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
      {/* Inline Gallery */}
      <section className={styles.gallerySection}>
        <div 
          className={styles.mainImage} 
          style={{ backgroundImage: `url(${displayImages[currentIndex]})`, cursor: 'pointer', position: 'relative' }}
          onClick={() => setIsFullscreen(true)}
        >
          {displayImages.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', color: 'white', border: '1px solid rgba(212,175,55,0.3)', width: '45px', height: '45px', cursor: 'pointer', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', transition: 'background 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(212,175,55,0.8)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
              >❮</button>
              <button 
                onClick={nextImage}
                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', color: 'white', border: '1px solid rgba(212,175,55,0.3)', width: '45px', height: '45px', cursor: 'pointer', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', transition: 'background 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(212,175,55,0.8)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
              >❯</button>
            </>
          )}
          <div style={{ position: 'absolute', bottom: '15px', right: '15px', background: 'rgba(0,0,0,0.8)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)' }}>
            {currentIndex + 1} / {displayImages.length} ⤢
          </div>
        </div>
      </section>

      {/* Fullscreen Lightbox */}
      {isFullscreen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <button 
            onClick={() => setIsFullscreen(false)} 
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer', zIndex: 10000 }}
          >✕</button>
          
          <div style={{ position: 'relative', width: '90%', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={displayImages[currentIndex]} 
              alt="Property Fullscreen" 
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
            />
            {displayImages.length > 1 && (
              <>
                <button onClick={prevImage} style={{ position: 'absolute', left: '-20px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '1.5rem', fontSize: '1.5rem', cursor: 'pointer', borderRadius: '50%' }}>❮</button>
                <button onClick={nextImage} style={{ position: 'absolute', right: '-20px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '1.5rem', fontSize: '1.5rem', cursor: 'pointer', borderRadius: '50%' }}>❯</button>
              </>
            )}
          </div>
          
          <div style={{ color: 'white', marginTop: '1rem', fontSize: '1.1rem' }}>
            {currentIndex + 1} of {displayImages.length}
          </div>
        </div>
      )}
    </>
  );
}
