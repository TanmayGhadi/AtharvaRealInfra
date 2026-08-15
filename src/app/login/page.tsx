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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--deep-forest, #0C241C)' }}>
      <div style={{ backgroundColor: 'var(--soft-cream, #EDE7DA)', padding: '3rem 2.5rem', borderRadius: '10px', border: '1px solid rgba(201, 162, 78, 0.3)', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Image src="/logo.jpg" alt="Atharva Admin Portal" width={76} height={76} style={{ margin: '0 auto', display: 'block', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--muted-champagne)' }} />
          <h2 style={{ color: 'var(--primary-forest)', marginTop: '1.25rem', fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>Admin Login</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.35rem' }}>Atharva Real Infra Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <input 
            type="password" 
            name="password" 
            placeholder="Enter Password" 
            required 
            className="form-input"
            style={{ backgroundColor: '#FFFFFF' }}
          />
          
          {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</p>}
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
