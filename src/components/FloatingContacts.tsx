'use client';

import { useEffect, useState } from 'react';

let cachedWhatsappNumber: string | null = null;
let cachedPhoneNumber: string | null = null;

export default function FloatingContacts() {
  const [isVisible, setIsVisible] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string>(
    cachedWhatsappNumber || process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '918788818163'
  );
  const [phoneNumber, setPhoneNumber] = useState<string>(
    cachedPhoneNumber || process.env.NEXT_PUBLIC_CONTACT_PHONE || '+918788818163'
  );

  useEffect(() => {
    // Small delay to prevent sudden pop-in
    const timeout = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (cachedWhatsappNumber && cachedPhoneNumber) {
      setWhatsappNumber(cachedWhatsappNumber);
      setPhoneNumber(cachedPhoneNumber);
      return;
    }
    
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.whatsapp_number) {
          cachedWhatsappNumber = data.whatsapp_number;
          setWhatsappNumber(data.whatsapp_number);
        }
        if (data?.phone_number) {
          cachedPhoneNumber = data.phone_number;
          setPhoneNumber(data.phone_number);
        }
      })
      .catch((err) => console.error('Failed to load settings:', err));
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 9999 }}>
      {/* CSS Styles injection */}
      <style dangerouslySetInnerHTML={{__html: `
        .floating-whatsapp-btn {
          animation: pulse-whatsapp 2s infinite;
          position: relative;
        }
        .floating-whatsapp-btn:hover {
          transform: scale(1.1) !important;
        }
        .floating-whatsapp-btn .tooltip {
          visibility: hidden;
          opacity: 0;
          position: absolute;
          right: 70px;
          top: 50%;
          transform: translateY(-50%);
          background-color: #111;
          color: var(--accent-gold, #D4AF37);
          border: 1px solid rgba(212,175,55,0.3);
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.85rem;
          white-space: nowrap;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5);
          transition: opacity 0.3s, visibility 0.3s;
          pointer-events: none;
          font-family: inherit;
        }
        .floating-whatsapp-btn:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }
        @keyframes pulse-whatsapp {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
          }
        }
      `}} />

      {/* Call Button */}
      <a 
        href={`tel:${phoneNumber.replace(/\s+/g, '')}`} 
        style={{
          width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-gold, #D4AF37)',
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
        href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Atharva%20Real%20Infra,%20I%20have%20an%20inquiry.`} 
        target="_blank" rel="noopener noreferrer"
        className="floating-whatsapp-btn"
        style={{
          width: '56px', height: '56px', borderRadius: '50%', background: '#25D366',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(37,211,102,0.4)', textDecoration: 'none', color: '#fff',
          transition: 'transform 0.3s ease'
        }}
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.18-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.098 8.098 0 0 1-1.24-4.38c0-4.47 3.64-8.11 8.11-8.11 2.16 0 4.2.84 5.73 2.37 1.53 1.53 2.37 3.57 2.37 5.73-.01 4.47-3.65 8.12-8.11 8.12zm4.44-6.07c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-1.54-.77-2.63-1.4-3.67-3.2-.27-.47.27-.44.78-1.46.08-.16.04-.3-.02-.42s-.54-1.3-.74-1.78c-.2-.48-.4-.41-.54-.42-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z"/>
        </svg>
        <span className="tooltip">Chat With Us On WhatsApp</span>
      </a>
    </div>
  );
}
