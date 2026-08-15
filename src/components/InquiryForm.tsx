'use client';

import { useState } from 'react';
import { submitLead } from '../app/properties/actions';

export default function InquiryForm({ propertyId, propertyTitle }: { propertyId: string, propertyTitle?: string }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  async function action(formData: FormData) {
    setStatus('submitting');
    const result = await submitLead(formData);
    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div style={{ padding: '1.5rem', background: 'rgba(46, 125, 50, 0.1)', border: '1px solid var(--primary-forest)', borderRadius: '8px', textAlign: 'center' }}>
        <h4 style={{ color: 'var(--primary-forest)', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>Inquiry Submitted!</h4>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Our property advisors will reach out to you shortly.</p>
        <button onClick={() => setStatus('idle')} className="btn-outline" style={{ marginTop: '1rem', width: '100%', fontSize: '0.8rem', padding: '0.5rem' }}>Send Another Inquiry</button>
      </div>
    );
  }

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <input type="hidden" name="property_id" value={propertyId} />
      <input type="text" name="name" placeholder="Your Name" required className="form-input" />
      <input type="email" name="email" placeholder="Email Address" required className="form-input" />
      <input type="tel" name="phone" placeholder="Phone Number" required className="form-input" />
      <textarea name="message" placeholder="I am interested in learning more about this property..." rows={4} required className="form-textarea"></textarea>
      
      {status === 'error' && (
        <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>Failed to submit inquiry. Please try calling directly.</p>
      )}

      <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.25rem' }} disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Submitting...' : 'Send Inquiry'}
      </button>
    </form>
  );
}
