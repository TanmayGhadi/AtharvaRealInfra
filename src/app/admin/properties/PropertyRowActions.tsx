'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteProperty, updatePropertyStatus } from './actions';
import Link from 'next/link';

export default function PropertyRowActions({ property }: { property: any }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property? This cannot be undone.')) return;
    setIsDeleting(true);
    try {
      await deleteProperty(property.id);
      router.refresh();
    } catch (err) {
      alert('Failed to delete property.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    try {
      await updatePropertyStatus(property.id, newStatus);
      router.refresh();
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'flex-end' }}>
      <select 
        value={property.status} 
        onChange={handleStatusChange} 
        disabled={isUpdating}
        style={{
          padding: '6px 12px',
          borderRadius: '6px',
          background: 'var(--bg-primary)',
          color: property.status === 'Available' ? '#4ade80' : (property.status === 'Sold' ? '#f87171' : '#fbbf24'),
          border: '1px solid rgba(255,255,255,0.2)',
          fontSize: '0.8rem',
          cursor: 'pointer',
          outline: 'none',
          minWidth: '100px'
        }}
      >
        <option value="Available" style={{color: '#fff'}}>Available</option>
        <option value="Sold" style={{color: '#fff'}}>Sold</option>
        <option value="Reserved" style={{color: '#fff'}}>Reserved</option>
      </select>
      
      <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: '6px' }}>
        <Link 
          href={`/properties/${property.id}`}
          target="_blank"
          title="Preview Property"
          style={{ padding: '4px 8px', color: 'var(--text-secondary)', transition: 'color 0.2s' }}
          onMouseOver={e => e.currentTarget.style.color = '#fff'}
          onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          👁️
        </Link>
        <Link 
          href={`/admin/properties/${property.id}/edit`} 
          title="Edit Property"
          style={{ padding: '4px 8px', color: 'var(--text-secondary)', transition: 'color 0.2s' }}
          onMouseOver={e => e.currentTarget.style.color = 'var(--accent-gold)'}
          onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          ✏️
        </Link>
        <button 
          onClick={handleDelete} 
          disabled={isDeleting}
          title="Delete Property"
          style={{ padding: '4px 8px', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', opacity: isDeleting ? 0.5 : 1, transition: 'color 0.2s' }}
          onMouseOver={e => e.currentTarget.style.color = '#f87171'}
          onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
