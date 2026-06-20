'use client';

import { useEffect, useState } from 'react';
import styles from './StickyActions.module.css';

export default function StickyActions() {
  const [isVisible, setIsVisible] = useState(false);
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+918788818163';
  const whatsapp = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '918788818163';

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={styles.stickyContainer}>
      <a href={`tel:${phone.replace(/\s+/g, '')}`} className={`${styles.actionButton} ${styles.callButton}`} aria-label="Call Us">
        📞
      </a>
      <a href={`https://wa.me/${whatsapp}?text=Hello%20Atharva%20Real%20Infra,%20I%20am%20interested%20in%20your%20properties.`} target="_blank" rel="noopener noreferrer" className={`${styles.actionButton} ${styles.whatsappButton}`} aria-label="WhatsApp Us">
        💬
      </a>
    </div>
  );
}
