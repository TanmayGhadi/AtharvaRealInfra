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
    if (!confirm(`Are you sure you want to delete "${property.title}"? This cannot be undone.`)) return;
    setIsDeleting(true);
    try {
      await deleteProperty(property.id);
      if (typeof window !== 'undefined' && (window as any).showAdminToast) {
        (window as any).showAdminToast('Changes Done! ✨', `Deleted listing "${property.title}".`, 'saved');
      }
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
      if (typeof window !== 'undefined' && (window as any).showAdminToast) {
        (window as any).showAdminToast('Changes Done! ✨', `Property status updated to "${newStatus}".`, 'saved');
      }
      router.refresh();
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Available':
        return { bg: '#DCFCE7', color: '#166534', border: '#86EFAC' };
      case 'Sold':
        return { bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5' };
      case 'Reserved':
        return { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' };
      case 'On Hold':
        return { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' };
      default:
        return { bg: '#EDE7DA', color: '#123128', border: 'rgba(18,49,40,0.2)' };
    }
  };

  const currentStatusStyle = getStatusStyle(property.status);

  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'flex-end' }}>
      <select 
        value={property.status || 'Available'} 
        onChange={handleStatusChange} 
        disabled={isUpdating}
        style={{
          padding: '6px 10px',
          borderRadius: '6px',
          background: currentStatusStyle.bg,
          color: currentStatusStyle.color,
          border: `1px solid ${currentStatusStyle.border}`,
          fontSize: '0.82rem',
          fontWeight: 700,
          cursor: 'pointer',
          outline: 'none',
          minWidth: '105px'
        }}
      >
        <option value="Available" style={{ color: '#17231F', background: '#FFFFFF' }}>Available</option>
        <option value="Sold" style={{ color: '#17231F', background: '#FFFFFF' }}>Sold</option>
        <option value="Reserved" style={{ color: '#17231F', background: '#FFFFFF' }}>Reserved</option>
        <option value="On Hold" style={{ color: '#17231F', background: '#FFFFFF' }}>On Hold</option>
      </select>
      
      <div style={{ display: 'flex', gap: '0.25rem', background: '#EDE7DA', padding: '0.25rem', borderRadius: '6px', border: '1px solid rgba(18,49,40,0.12)' }}>
        <Link 
          href={`/properties/${property.id}`}
          target="_blank"
          title="View Public Page"
          style={{ 
            padding: '5px 8px', 
            color: '#123128', 
            fontSize: '0.9rem',
            borderRadius: '4px',
            transition: 'all 0.15s ease',
            textDecoration: 'none'
          }}
        >
          👁️
        </Link>
        <Link 
          href={`/admin/properties/${property.id}/edit`} 
          title="Edit Property"
          style={{ 
            padding: '5px 8px', 
            color: '#123128', 
            fontSize: '0.9rem',
            borderRadius: '4px',
            transition: 'all 0.15s ease',
            textDecoration: 'none'
          }}
        >
          ✏️
        </Link>
        <button 
          onClick={handleDelete} 
          disabled={isDeleting}
          title="Delete Property"
          style={{ 
            padding: '5px 8px', 
            color: '#991B1B', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '0.9rem',
            opacity: isDeleting ? 0.5 : 1,
            borderRadius: '4px',
            transition: 'all 0.15s ease'
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
