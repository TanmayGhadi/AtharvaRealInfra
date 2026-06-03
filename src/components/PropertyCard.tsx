'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../app/page.module.css'; // Adjust path if needed, we'll create a standalone CSS or use global classes

export default function PropertyCard({ prop, index = 0, styleClass = '' }: { prop: any, index?: number, styleClass?: string }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  let parsedImages = [];
  try {
    parsedImages = typeof prop.images === 'string' ? JSON.parse(prop.images) : prop.images;
  } catch(e) {}
  if (!Array.isArray(parsedImages)) parsedImages = [];

  const displayImages = parsedImages.length > 0 
    ? parsedImages 
    : ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'];

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) setCurrentImage((prev) => (prev + 1) % displayImages.length);
    if (distance < -50) setCurrentImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    setTouchStart(0); setTouchEnd(0);
  };

  useEffect(() => {
    if (displayImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % displayImages.length);
    }, 4000); // Auto-scroll every 4 seconds
    return () => clearInterval(interval);
  }, [displayImages.length]);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <Link href={`/properties/${prop.id}`} className={`${styleClass} reveal stagger-${index + 1}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit', height: '100%' }}>
      <div className={styles.propertyCard} style={{ height: '100%', padding: '0.75rem', display: 'flex', flexDirection: 'column' }}>
        <div className={styles.propertyImage} style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', height: '280px', flexShrink: 0 }}>
          
          {/* Image Slider */}
          <div 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ 
              display: 'flex', 
              width: `${displayImages.length * 100}%`, 
              height: '100%',
              transform: `translateX(-${currentImage * (100 / displayImages.length)}%)`,
              transition: 'transform 0.5s ease-in-out'
            }}>
            {displayImages.map((img: string, i: number) => (
              <div 
                key={i} 
                style={{ 
                  width: `${100 / displayImages.length}%`, 
                  height: '100%', 
                  backgroundImage: `url(${img})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center',
                  flexShrink: 0
                }}
              />
            ))}
          </div>

          <div className={styles.badge}>{prop.property_type || 'Premium'}</div>
          <div className={styles.imageOverlay}></div>
          
          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
              >❮</button>
              <button 
                onClick={nextImage}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
              >❯</button>
              
              {/* Dots */}
              <div style={{ position: 'absolute', bottom: '10px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '5px', zIndex: 10 }}>
                {displayImages.map((_: any, i: number) => (
                  <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === currentImage ? 'var(--accent-gold)' : 'rgba(255,255,255,0.5)' }} />
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className={styles.propertyInfo} style={{ padding: '1rem 0.5rem 0.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 className={styles.propertyTitle}>{prop.title}</h3>
          <p className={styles.propertyLocation}>📍 {prop.village}, {prop.taluka}</p>
          <div className={styles.propertyFeatures}>
            <span>{prop.area_display}</span>
            <span className={styles.statusBadge}>{prop.status}</span>
          </div>
          <div className={styles.propertyFooter} style={{flexDirection: 'column', alignItems: 'stretch', gap: '0.8rem', marginTop: 'auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div className={styles.price}>{prop.price_display}</div>
              <div className="btn-outline" style={{padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', pointerEvents: 'none'}}>View Details</div>
            </div>
            <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE || '+917843097793'}`; }}
                 className="btn-primary" 
                 style={{flex: 1, textAlign: 'center', padding: '6px', fontSize: '0.8rem', border: 'none'}}>Call</button>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(`https://wa.me/${process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '917843097793'}?text=Hi, I am interested in property ${prop.title}`, '_blank'); }}
                 className="btn-outline" 
                 style={{flex: 1, textAlign: 'center', padding: '6px', fontSize: '0.8rem', borderColor: '#25D366', color: '#25D366'}}>WhatsApp</button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
