'use client';

import { useState } from 'react';
import { loginAction } from './actions';
import Image from 'next/image';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);
    
    if (result && result.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div style={{ background: 'var(--bg-card)', padding: '3rem', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Image src="/logo.jpg" alt="Atharva Admin" width={80} height={80} style={{ margin: '0 auto', display: 'block', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-gold)' }} />
          <h2 style={{ color: 'var(--accent-gold)', marginTop: '1rem', fontSize: '1.5rem', fontFamily: 'var(--font-sans)' }}>Admin Login</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Enter password to access the portal</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            required 
            style={{ padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px', width: '100%' }}
          />
          
          {error && <p style={{ color: '#f87171', fontSize: '0.85rem' }}>{error}</p>}
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
