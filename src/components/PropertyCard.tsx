'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../app/page.module.css'; // Adjust path if needed, we'll create a standalone CSS or use global classes

let cachedWhatsappNumber: string | null = null;

export default function PropertyCard({ prop, index = 0, styleClass = '' }: { prop: any, index?: number, styleClass?: string }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [whatsappNumber, setWhatsappNumber] = useState<string>(
    cachedWhatsappNumber || '918788818163'
  );

  useEffect(() => {
    if (cachedWhatsappNumber) {
      setWhatsappNumber(cachedWhatsappNumber);
      return;
    }
    
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.whatsapp_number) {
          cachedWhatsappNumber = data.whatsapp_number;
          setWhatsappNumber(data.whatsapp_number);
        }
      })
      .catch((err) => console.error('Failed to load settings in card:', err));
  }, []);
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
    <Link href={`/properties/${prop.slug || prop.id}`} className={`${styleClass} reveal stagger-${index + 1}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit', height: '100%' }}>
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
                role="img"
                aria-label={`Property image ${i + 1}: ${prop.title} - ${prop.property_type} in ${prop.village}, ${prop.taluka}`}
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
               <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `tel:+918788818163`; }}
                 className="btn-primary" 
                 style={{flex: 1, textAlign: 'center', padding: '6px', fontSize: '0.8rem', border: 'none'}}>Call</button>
              <button onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                const text = `Hello Atharva Real Infra,\n\nI am interested in the following property:\n\nProperty Name:\n${prop.title}\n\nProperty ID:\n${prop.id}\n\nLocation:\n${prop.village || ''}, ${prop.taluka || ''}\n\nPlease share more details.`;
                window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank'); 
              }}
                 className="btn-outline" 
                 style={{
                   flex: 1, 
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   gap: '4px',
                   textAlign: 'center', 
                   padding: '6px', 
                   fontSize: '0.8rem', 
                   borderColor: '#25D366', 
                   color: '#25D366'
                 }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.18-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.098 8.098 0 0 1-1.24-4.38c0-4.47 3.64-8.11 8.11-8.11 2.16 0 4.2.84 5.73 2.37 1.53 1.53 2.37 3.57 2.37 5.73-.01 4.47-3.65 8.12-8.11 8.12zm4.44-6.07c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-1.54-.77-2.63-1.4-3.67-3.2-.27-.47.27-.44.78-1.46.08-.16.04-.3-.02-.42s-.54-1.3-.74-1.78c-.2-.48-.4-.41-.54-.42-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z"/>
                </svg>
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
