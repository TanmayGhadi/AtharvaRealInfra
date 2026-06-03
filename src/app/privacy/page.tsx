import React from 'react';

export default function PrivacyPage() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '100px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="section-container" style={{ maxWidth: '800px', background: 'var(--bg-card)', padding: '3rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h1 className="text-gold" style={{ marginBottom: '2rem' }}>Privacy Policy</h1>
        <p className="text-secondary" style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
          At Atharva Real Infra, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information.
        </p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--accent-gold)' }}>1. Information We Collect</h3>
        <p className="text-secondary" style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
          We collect personal information that you voluntarily provide when making inquiries, subscribing to newsletters, or contacting us. This includes your name, email address, phone number, and any specific property interests.
        </p>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--accent-gold)' }}>2. How We Use Your Information</h3>
        <p className="text-secondary" style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
          Your data is used to provide tailored real estate consultancy, respond to your inquiries, send relevant property alerts, and improve our platform's user experience. We never sell your personal information to third-party marketers.
        </p>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--accent-gold)' }}>3. Data Security</h3>
        <p className="text-secondary" style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
          We implement industry-standard security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Our database infrastructure (powered by Supabase) enforces strict Row Level Security.
        </p>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--accent-gold)' }}>4. Third-Party Links</h3>
        <p className="text-secondary" style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
          Our website may contain links to social media networks (Facebook, Instagram, YouTube) and mapping services (Google Maps). We are not responsible for the privacy practices of these external platforms.
        </p>

        <p className="text-secondary" style={{ marginTop: '3rem', fontSize: '0.9rem' }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
