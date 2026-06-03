'use client';

import { useState } from 'react';
import { updateLeadStatus, deleteLead } from './actions';

export default function LeadRow({ lead }: { lead: any }) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await updateLeadStatus(lead.id, newStatus);
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to archive this lead?')) return;
    setLoading(true);
    try {
      await deleteLead(lead.id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete lead');
    }
    setLoading(false);
  };

  const statusColors: any = {
    'New': '#facc15',
    'Contacted': '#60a5fa',
    'Qualified': '#4ade80',
    'Follow Up': '#fb923c',
    'Closed': '#94a3b8'
  };

  return (
    <tr style={{ opacity: loading ? 0.5 : 1, borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="hover-bg-light">
      <td style={{ padding: '1.25rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
            {lead.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{lead.name}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{new Date(lead.created_at).toLocaleDateString()}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: '1.25rem 1rem' }}>
        <div style={{ marginBottom: '0.25rem' }}>
          <a href={`tel:${lead.phone}`} style={{ color: 'white', textDecoration: 'none' }} title="Call">{lead.phone} 📞</a>
        </div>
        {lead.email && <div>
          <a href={`mailto:${lead.email}`} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none' }} title="Email">{lead.email} ✉️</a>
        </div>}
      </td>
      <td style={{ padding: '1.25rem 1rem', maxWidth: '250px' }}>
        <div style={{ fontSize: '0.9rem', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {lead.message || 'No message provided'}
        </div>
      </td>
      <td style={{ padding: '1.25rem 1rem' }}>
        <span style={{ padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.8rem' }}>
          {lead.property_id ? 'Property Inquiry' : (lead.source || 'Website')}
        </span>
      </td>
      <td style={{ padding: '1.25rem 1rem' }}>
        <select 
          value={lead.status || 'New'} 
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={loading}
          style={{ 
            background: 'var(--bg-primary)', 
            color: statusColors[lead.status || 'New'] || 'white', 
            padding: '0.4rem 0.8rem', 
            border: `1px solid ${statusColors[lead.status || 'New'] || 'rgba(255,255,255,0.2)'}`, 
            borderRadius: '6px',
            fontSize: '0.85rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="New" style={{color: 'white'}}>New</option>
          <option value="Contacted" style={{color: 'white'}}>Contacted</option>
          <option value="Follow Up" style={{color: 'white'}}>Follow Up</option>
          <option value="Qualified" style={{color: 'white'}}>Qualified</option>
          <option value="Closed" style={{color: 'white'}}>Closed</option>
        </select>
      </td>
      <td style={{ padding: '1.25rem 1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a 
            href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(lead.name)},%20I%20am%20reaching%20out%20from%20Atharva%20Real%20Infra.`}
            target="_blank"
            rel="noreferrer"
            title="WhatsApp"
            style={{ padding: '0.4rem', background: 'rgba(37,211,102,0.1)', color: '#25D366', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            💬
          </a>
          <button 
            onClick={() => handleStatusChange('Contacted')} 
            disabled={loading || lead.status === 'Contacted'} 
            title="Mark Contacted"
            style={{ padding: '0.4rem', background: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            ✓
          </button>
          <button 
            onClick={handleDelete} 
            disabled={loading} 
            title="Archive Lead"
            style={{ padding: '0.4rem', background: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
}
