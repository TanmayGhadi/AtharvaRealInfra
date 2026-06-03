'use client';

import { useEffect, useState } from 'react';

export default function FloatingContacts() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to prevent sudden pop-in
    const timeout = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 9999 }}>
      {/* Call Button */}
      <a 
        href="tel:+917843097793" 
        style={{
          width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(212,175,55,0.4)', textDecoration: 'none', color: '#000',
          fontSize: '1.5rem', transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        📞
      </a>
      
      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/917843097793?text=Hello%20Atharva%20Real%20Infra,%20I%20have%20an%20inquiry." 
        target="_blank" rel="noopener noreferrer"
        style={{
          width: '56px', height: '56px', borderRadius: '50%', background: '#25D366',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(37,211,102,0.4)', textDecoration: 'none', color: '#fff',
          fontSize: '1.8rem', transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor">
          <path d="M16 2.5a13.5 13.5 0 0 0-11.41 20.73L2.5 30l6.93-2.05A13.5 13.5 0 1 0 16 2.5zm0 2.2a11.3 11.3 0 0 1 9.68 17.15l-4.14 1.2-1.28-4.04a11.3 11.3 0 1 1-4.26-14.3zM10.4 12.3c-.33 0-.85.12-1.3.62s-1.74 1.7-1.74 4.14 1.78 4.8 2.02 5.12 3.4 5.38 8.35 7.37c1.17.47 2.08.75 2.8.96 1.18.35 2.26.3 3.1.18.96-.13 2.94-1.2 3.35-2.36.42-1.16.42-2.16.3-2.37-.13-.2-.48-.33-1-.58s-3.08-1.52-3.56-1.7-.82-.26-1.17.26c-.34.52-1.35 1.7-1.66 2.05-.3.34-.6.38-1.1.13a9.92 9.92 0 0 1-4.85-3.02 10.97 10.97 0 0 1-2.02-3.4c-.3-.52-.03-.8.22-1.06.23-.24.52-.6.78-.92.26-.3.35-.5.52-.85.17-.34.09-.64-.04-.9s-1.18-2.85-1.62-3.9c-.43-1.02-.86-.88-1.17-.9-.3-.02-.62-.02-.95-.02z"/>
        </svg>
      </a>
    </div>
  );
}
