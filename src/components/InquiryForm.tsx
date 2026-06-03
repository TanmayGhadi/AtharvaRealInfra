'use client';

import { useState } from 'react';
import { submitLead } from '../app/properties/actions';
import styles from '../app/properties/[id]/page.module.css';

export default function InquiryForm({ propertyId, propertyTitle }: { propertyId: string, propertyTitle?: string }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formDataState, setFormDataState] = useState<{name: string, phone: string, message: string}>({name: '', phone: '', message: ''});

  async function action(formData: FormData) {
    setStatus('submitting');
    setFormDataState({
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
    });
    const result = await submitLead(formData);
    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div style={{ padding: '1.5rem', background: 'rgba(74, 222, 128, 0.1)', border: '1px solid #4ade80', borderRadius: '8px', textAlign: 'center' }}>
        <h4 style={{ color: '#4ade80', marginBottom: '0.5rem' }}>Inquiry Submitted!</h4>
        <p style={{ fontSize: '0.9rem' }}>Our luxury property advisors will contact you shortly.</p>
        <button onClick={() => setStatus('idle')} className="btn-outline" style={{ marginTop: '1rem', width: '100%' }}>Send Another</button>
      </div>
    );
  }

  return (
    <form action={action} className={styles.inquiryForm}>
      <input type="hidden" name="property_id" value={propertyId} />
      <input type="text" name="name" placeholder="Your Name" required />
      <input type="email" name="email" placeholder="Email Address" required />
      <input type="tel" name="phone" placeholder="Phone Number" required />
      <textarea name="message" placeholder="I am interested in this property..." rows={4} required></textarea>
      
      {status === 'error' && (
        <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>Failed to submit. Please try again.</p>
      )}

      <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Submitting...' : 'Submit Inquiry'}
      </button>
    </form>
  );
}
