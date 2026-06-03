'use client';

import { useState } from 'react';
import { addVillage, editVillage, deleteVillage } from './actions';
import styles from '../admin.module.css';

export default function LocationManager({ districts, talukas, villages }: any) {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedTaluka, setSelectedTaluka] = useState<string>('');
  const [search, setSearch] = useState('');
  
  const [isEditing, setIsEditing] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const filteredTalukas = selectedDistrict 
    ? talukas.filter((t: any) => t.district_id.toString() === selectedDistrict)
    : talukas;

  const filteredVillages = villages.filter((v: any) => {
    if (selectedTaluka && v.taluka_id.toString() !== selectedTaluka) return false;
    if (selectedDistrict && v.talukas?.district_id?.toString() !== selectedDistrict) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await addVillage(formData);
    e.currentTarget.reset();
    setLoading(false);
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isEditing) return;
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await editVillage(
      isEditing.id, 
      formData.get('name') as string, 
      formData.get('taluka_id') as string
    );
    setIsEditing(null);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this village?')) return;
    setLoading(true);
    await deleteVillage(id);
    setLoading(false);
  }

  return (
    <div className="grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
      {/* Village List */}
      <div className={styles.tableCard} style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        
        <div style={{ padding: '1.5rem', background: 'rgba(212,175,55,0.05)', borderBottom: '1px solid rgba(212,175,55,0.1)', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: 'var(--accent-gold)', flex: '1 1 100%' }}>Village Directory</h3>
          
          <select 
            value={selectedDistrict} 
            onChange={e => { setSelectedDistrict(e.target.value); setSelectedTaluka(''); }}
            style={{ padding: '0.6rem 1rem', background: 'var(--bg-primary)', color: 'white', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '6px', outline: 'none', flex: '1 1 120px' }}
          >
            <option value="">All Districts</option>
            {districts.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          
          <select 
            value={selectedTaluka} 
            onChange={e => setSelectedTaluka(e.target.value)}
            style={{ padding: '0.6rem 1rem', background: 'var(--bg-primary)', color: 'white', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '6px', outline: 'none', flex: '1 1 120px' }}
          >
            <option value="">All Talukas</option>
            {filteredTalukas.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>

          <input 
            type="text" 
            placeholder="Search villages..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '0.6rem 1rem', flex: '2 1 200px', background: 'var(--bg-primary)', color: 'white', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '6px', outline: 'none' }}
          />
        </div>

        <div className={styles.tableWrapper} style={{ maxHeight: '600px', overflowY: 'auto', padding: '0' }}>
          <table className={styles.table} style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1, borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Village Name</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Taluka (District)</th>
                <th style={{ textAlign: 'right', padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVillages.map((v: any) => (
                <tr key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{v.name}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>
                    {v.talukas?.name} <span style={{ opacity: 0.5 }}>({districts.find((d:any) => d.id === v.talukas?.district_id)?.name})</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => setIsEditing(v)} className="btn-outline" style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: '4px' }}>Edit</button>
                    <button onClick={() => handleDelete(v.id)} className="btn-outline" style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: '4px', borderColor: 'rgba(211, 47, 47, 0.5)', color: 'var(--danger)' }}>Delete</button>
                  </td>
                </tr>
              ))}
              {filteredVillages.length === 0 && (
                <tr><td colSpan={3} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No villages found matching your criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Form */}
      <div className={styles.tableCard} style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '2rem', height: 'fit-content', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', position: 'sticky', top: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)', fontSize: '1.4rem', borderBottom: '1px solid rgba(212,175,55,0.1)', paddingBottom: '1rem' }}>
          {isEditing ? '✎ Edit Village Details' : '➕ Add New Village'}
        </h3>
        <form onSubmit={isEditing ? handleEdit : handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Assign to Taluka</label>
            <select 
              name="taluka_id" 
              required 
              defaultValue={isEditing ? isEditing.taluka_id : selectedTaluka}
              style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-primary)', color: 'white', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '6px', outline: 'none' }}
            >
              <option value="">Select Taluka...</option>
              {talukas.map((t: any) => (
                <option key={t.id} value={t.id}>{t.name} (District: {t.districts?.name})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Village Name</label>
            <input 
              type="text" 
              name="name" 
              required 
              defaultValue={isEditing ? isEditing.name : ''}
              placeholder="e.g. Shirgaon"
              style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-primary)', color: 'white', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '6px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, padding: '1rem', borderRadius: '6px', fontSize: '1rem' }}>
              {loading ? 'Saving Changes...' : (isEditing ? 'Update Village' : 'Save Village')}
            </button>
            {isEditing && (
              <button type="button" onClick={() => setIsEditing(null)} className="btn-outline" style={{ padding: '1rem', borderRadius: '6px' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
