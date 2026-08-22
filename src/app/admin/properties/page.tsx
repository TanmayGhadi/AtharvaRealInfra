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
          <p style={{ marginTop: '0.4rem', color: '#3D4A41', fontSize: '0.95rem', fontWeight: 500 }}>
            Manage your premium land listings and investments.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a 
            href="/Bulk properties.xlsx" 
            download="Bulk properties.xlsx"
            className="btn-outline" 
            style={{ 
              padding: '10px 16px', 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem',
              borderColor: '#123128',
              color: '#123128',
              textDecoration: 'none'
            }}
          >
            📥 DOWNLOAD TEMPLATE
          </a>
          <Link 
            href="/admin/properties/bulk" 
            className="btn-outline" 
            style={{ 
              padding: '10px 20px', 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              borderColor: '#123128',
              color: '#123128'
            }}
          >
            📊 BULK ACTIONS / IMPORT
          </Link>
          <Link 
            href="/admin/properties/new" 
            className="btn-primary" 
            style={{ 
              padding: '10px 20px', 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              backgroundColor: '#123128',
              color: '#FFFFFF'
            }}
          >
            + ADD NEW PROPERTY
          </Link>
        </div>
      </div>
      
      {error && (
        <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600 }}>
          Error loading properties: {error.message}
        </div>
      )}

      <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', background: '#F5F1E8', borderBottom: '1px solid rgba(18, 49, 40, 0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div className={styles.search}>
            <input type="text" placeholder="Search properties by title, village or location..." style={{ background: '#FFFFFF', borderColor: 'rgba(18, 49, 40, 0.25)', color: '#17231F' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <select className={styles.chartSelect} style={{ background: '#FFFFFF', borderColor: 'rgba(18, 49, 40, 0.25)', color: '#17231F', fontWeight: 600 }}>
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Reserved">Reserved</option>
              <option value="On Hold">On Hold</option>
            </select>
            <select className={styles.chartSelect} style={{ background: '#FFFFFF', borderColor: 'rgba(18, 49, 40, 0.25)', color: '#17231F', fontWeight: 600 }}>
              <option value="">Sort By</option>
              <option value="newest">Newest First</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="price_asc">Price: Low to High</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(18, 49, 40, 0.15)', background: '#EDE7DA' }}>
                <th style={{ padding: '1rem 1.25rem', color: '#123128', width: '40px' }}><input type="checkbox" /></th>
                <th style={{ padding: '1rem 1rem', color: '#123128', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Property Details</th>
                <th style={{ padding: '1rem 1rem', color: '#123128', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</th>
                <th style={{ padding: '1rem 1rem', color: '#123128', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price & Area</th>
                <th style={{ padding: '1rem 1.25rem', color: '#123128', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Status & Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties && properties.length > 0 ? properties.map((prop) => {
                const thumb = prop.thumbnail_image || (Array.isArray(prop.images) && prop.images[0]) || '/banner%201.png';
                return (
                  <tr key={prop.id} style={{ borderBottom: '1px solid rgba(18, 49, 40, 0.08)', background: '#FFFFFF', transition: 'background 0.15s ease' }}>
                    <td style={{ padding: '1rem 1.25rem' }}><input type="checkbox" /></td>
                    <td style={{ padding: '1rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                          width: '64px', 
                          height: '64px', 
                          borderRadius: '8px', 
                          background: '#EDE7DA', 
                          overflow: 'hidden', 
                          backgroundImage: `url(${thumb})`, 
                          backgroundSize: 'cover', 
                          backgroundPosition: 'center',
                          border: '1px solid rgba(18,49,40,0.15)',
                          flexShrink: 0
                        }}></div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#17231F', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span>{prop.title}</span>
                            {prop.is_featured && (
                              <span style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '12px', fontWeight: 800 }}>
                                FEATURED
                              </span>
                            )}
                          </div>
                          <div style={{ color: '#5D665F', fontSize: '0.82rem', fontWeight: 600 }}>
                            ID: <span style={{ color: '#17231F' }}>{prop.id.substring(0, 8).toUpperCase()}</span> • {prop.property_type || 'Agricultural'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#17231F', fontSize: '0.92rem' }}>{prop.village}</div>
                      <div style={{ color: '#5D665F', fontSize: '0.82rem', fontWeight: 500 }}>{prop.taluka}, {prop.district}</div>
                    </td>
                    <td style={{ padding: '1rem 1rem' }}>
                      <div style={{ fontWeight: 800, color: '#123128', fontSize: '0.98rem' }}>{prop.price_display}</div>
                      <div style={{ color: '#5D665F', fontSize: '0.82rem', fontWeight: 500 }}>{prop.area_display || `${prop.area_sqm} sqm`}</div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <PropertyRowActions property={prop} />
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} style={{ padding: '4rem 2rem', textAlign: 'center', background: '#FFFFFF' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏗️</div>
                    <p style={{ fontSize: '1.25rem', color: '#123128', fontWeight: 700, marginBottom: '0.4rem' }}>
                      No properties found
                    </p>
                    <p style={{ color: '#3D4A41', fontSize: '0.95rem' }}>
                      Add your first premium listing manually or use bulk import.
                    </p>
                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <Link href="/admin/properties/bulk" className="btn-outline" style={{ borderColor: '#123128', color: '#123128', fontWeight: 700 }}>
                        Bulk Import
                      </Link>
                      <Link href="/admin/properties/new" className="btn-primary" style={{ backgroundColor: '#123128', color: '#FFFFFF', fontWeight: 700 }}>
                        + Add Property
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
