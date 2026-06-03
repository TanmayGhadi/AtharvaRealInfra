'use client';

import { useState } from 'react';
import { updateSettings } from './actions';
import styles from '../admin.module.css';

export default function SettingsForm({ initialData }: { initialData: any }) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  async function action(formData: FormData) {
    setStatus('saving');
    try {
      await updateSettings(formData);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  return (
    <form action={action} className={styles.card} style={{ display: 'grid', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Company Name</label>
          <input type="text" name="company_name" defaultValue={initialData?.company_name || ''} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Address</label>
          <input type="email" name="email_address" defaultValue={initialData?.email_address || ''} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Phone Number</label>
          <input type="text" name="phone_number" defaultValue={initialData?.phone_number || ''} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>WhatsApp Number</label>
          <input type="text" name="whatsapp_number" defaultValue={initialData?.whatsapp_number || ''} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Office Address</label>
        <textarea name="office_address" rows={3} defaultValue={initialData?.office_address || ''} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }}></textarea>
      </div>

      <h3 style={{ marginTop: '1rem', borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '1.5rem' }}>Social Media Links</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Instagram URL</label>
          <input type="url" name="instagram_url" defaultValue={initialData?.instagram_url || ''} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Facebook URL</label>
          <input type="url" name="facebook_url" defaultValue={initialData?.facebook_url || ''} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>YouTube URL</label>
          <input type="url" name="youtube_url" defaultValue={initialData?.youtube_url || ''} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>LinkedIn URL</label>
          <input type="url" name="linkedin_url" defaultValue={initialData?.linkedin_url || ''} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
        </div>
      </div>

      <h3 style={{ marginTop: '1rem', borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '1.5rem' }}>Website Branding & SEO</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Logo URL</label>
          <input type="url" name="logo_url" defaultValue={initialData?.logo_url || ''} placeholder="https://res.cloudinary.com/..." style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>SEO Site Title</label>
          <input type="text" name="seo_title" defaultValue={initialData?.seo_title || ''} placeholder="Atharva Real Infra - Premium Land Investments" style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>SEO Meta Description</label>
          <textarea name="seo_description" rows={2} defaultValue={initialData?.seo_description || ''} placeholder="Premium agricultural and investment lands across Sindhudurg." style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }}></textarea>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit" className="btn-primary" disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving...' : 'Save Settings'}
        </button>
        {status === 'success' && <span style={{ color: '#4ade80' }}>Settings saved successfully!</span>}
        {status === 'error' && <span style={{ color: '#f87171' }}>Failed to save settings.</span>}
      </div>
    </form>
  );
}
