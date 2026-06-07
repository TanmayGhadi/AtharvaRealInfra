import Link from "next/link";
import { getServiceSupabase } from "@/lib/supabase";
import styles from "../admin.module.css";
import PropertyRowActions from "./PropertyRowActions";

export const revalidate = 0; // Don't cache admin pages

export default async function AdminProperties() {
  const adminSupabase = getServiceSupabase();
  const { data: properties, error } = await adminSupabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <div>
          <h1>Property Management</h1>
          <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Manage your premium land listings and investments.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/admin/properties/bulk" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
            Bulk Actions / Import
          </Link>
          <Link href="/admin/properties/new" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            + Add New Property
          </Link>
        </div>
      </div>
      
      {error && <div style={{ background: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>Error loading properties: {error.message}</div>}

      <div className={styles.chartCard} style={{ overflowX: 'auto', padding: 0 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className={styles.search}>
            <input type="text" placeholder="Search properties by title or location..." />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select className={styles.chartSelect}>
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Reserved">Reserved</option>
            </select>
            <select className={styles.chartSelect}>
              <option value="">Sort By</option>
              <option value="newest">Newest First</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="price_asc">Price: Low to High</option>
            </select>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.2)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', width: '40px' }}><input type="checkbox" /></th>
              <th style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)' }}>Property Details</th>
              <th style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)' }}>Location</th>
              <th style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)' }}>Price & Area</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Status & Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties && properties.length > 0 ? properties.map((prop) => (
              <tr key={prop.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s ease' }} className="hover-bg-light">
                <td style={{ padding: '1.25rem 1.5rem' }}><input type="checkbox" /></td>
                <td style={{ padding: '1.25rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'var(--bg-primary)', overflow: 'hidden', backgroundImage: `url(${prop.image_url || '/banner%201.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {prop.title}
                        {prop.is_featured && <span style={{ background: 'var(--accent-gold)', color: 'black', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '12px', fontWeight: 'bold' }}>FEATURED</span>}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>ID: {prop.id.substring(0,8).toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1rem' }}>
                  <div style={{ fontWeight: '500' }}>{prop.village}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{prop.taluka}, {prop.district}</div>
                </td>
                <td style={{ padding: '1.25rem 1rem' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent-gold)' }}>{prop.price_display}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{prop.area}</div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <PropertyRowActions property={prop} />
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🏗️</div>
                  <p style={{ fontSize: '1.2rem', color: 'white', marginBottom: '0.5rem' }}>No properties found</p>
                  <p>Add your first premium listing to start managing.</p>
                  <Link href="/admin/properties/new" className="btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>Add Property</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
