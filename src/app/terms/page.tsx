import React from 'react';

export default function TermsPage() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '100px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="section-container" style={{ maxWidth: '800px', background: 'var(--bg-card)', padding: '3rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h1 className="text-gold" style={{ marginBottom: '2rem' }}>Terms of Service</h1>
        <p className="text-secondary" style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
          Welcome to Atharva Real Infra. By accessing or using our website and services, you agree to comply with and be bound by the following terms and conditions.
        </p>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--accent-gold)' }}>1. Acceptance of Terms</h3>
        <p className="text-secondary" style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
          By engaging with Atharva Real Infra, viewing properties on our platform, or communicating with our agents, you accept these terms in full. If you disagree with these terms, you must not use our website.
        </p>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--accent-gold)' }}>2. Property Information</h3>
        <p className="text-secondary" style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
          While we strive for accuracy, property details, prices, and availability are subject to change without notice. All dimensions, areas, and financial data provided are approximate and should be independently verified. Atharva Real Infra is not liable for discrepancies.
        </p>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--accent-gold)' }}>3. Legal and Title Verification</h3>
        <p className="text-secondary" style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
          We conduct thorough preliminary title checks. However, final legal verification is the responsibility of the buyer. We highly recommend engaging independent legal counsel before executing any sale deeds or financial transfers.
        </p>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--accent-gold)' }}>4. Limitation of Liability</h3>
        <p className="text-secondary" style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
          Atharva Real Infra shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our website or services, or from investments made based on our consultation.
        </p>

        <p className="text-secondary" style={{ marginTop: '3rem', fontSize: '0.9rem' }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
