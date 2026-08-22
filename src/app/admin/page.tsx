import styles from "./admin.module.css";
import { getServiceSupabase } from "@/lib/supabase";

export const revalidate = 0;

export default async function AdminDashboard() {
  const adminSupabase = getServiceSupabase();

  // Fetch Properties
  const { data: properties } = await adminSupabase.from('properties').select('*');
  const allProperties = properties || [];
  
  const totalProperties = allProperties.length;
  const soldProperties = allProperties.filter(p => p.status === 'Sold').length;
  const reservedProperties = allProperties.filter(p => p.status === 'Reserved').length;
  const availableProperties = allProperties.filter(p => p.status === 'Available').length;

  const featuredProperties = allProperties.filter(p => p.is_featured).length;

  // Fetch Leads
  const { data: leads } = await adminSupabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  const recentLeads = leads || [];
  const { count: totalLeads } = await adminSupabase.from('leads').select('*', { count: 'exact', head: true });
  
  // Location Stats
  const { count: totalDistricts } = await adminSupabase.from('districts').select('*', { count: 'exact', head: true });
  const { count: totalTalukas } = await adminSupabase.from('talukas').select('*', { count: 'exact', head: true });

  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <div>
          <h1>Dashboard Overview</h1>
          <p style={{ marginTop: '0.4rem', color: '#3D4A41', fontSize: '0.95rem', fontWeight: 500 }}>
            Welcome back to your Atharva Real Infra admin workspace.
          </p>
        </div>
        <a href="/admin/properties/bulk" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem', fontWeight: 700, backgroundColor: '#123128', color: '#FFFFFF', textDecoration: 'none' }}>
          📊 Bulk Import Properties
        </a>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏢</div>
          <div className={styles.statContent}>
            <h3>Total Properties</h3>
            <div className={styles.statValue}>{totalProperties}</div>
            <div className={styles.statChange}>{availableProperties} Active Listings</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statContent}>
            <h3>Featured</h3>
            <div className={styles.statValue}>{featuredProperties}</div>
            <div className={styles.statChange}>Premium Placements</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🤝</div>
          <div className={styles.statContent}>
            <h3>Sold / Reserved</h3>
            <div className={styles.statValue}>{soldProperties + reservedProperties}</div>
            <div className={styles.statChange}>{soldProperties} Sold | {reservedProperties} Reserved</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📈</div>
          <div className={styles.statContent}>
            <h3>Total Leads</h3>
            <div className={styles.statValue}>{totalLeads || 0}</div>
            <div className={styles.statChange}>Website Inquiries</div>
          </div>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div>
          <div className={styles.chartCard} style={{ marginBottom: '1.5rem' }}>
            <div className={styles.cardHeader}>
              <h3>System Overview</h3>
              <select className={styles.chartSelect}>
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Year</option>
              </select>
            </div>
            <div style={{ padding: '3rem 2rem', textAlign: 'center', background: '#F5F1E8', borderRadius: '8px', border: '1px solid rgba(18,49,40,0.12)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>📊</span>
              <div style={{ fontSize: '1.1rem', color: '#123128', fontWeight: 700 }}>Database & Analytics Active</div>
              <p style={{ color: '#5D665F', fontSize: '0.9rem', margin: '0.4rem 0 0 0' }}>
                {totalProperties} Total Listed Properties • {totalLeads || 0} Customer Leads
              </p>
            </div>
          </div>
          
          <div className={styles.chartCard}>
            <div className={styles.cardHeader}>
              <h3>Location Coverage</h3>
              <a href="/admin/locations" className={styles.cardLink}>Manage Locations →</a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ padding: '1.5rem', background: '#F5F1E8', borderRadius: '8px', border: '1px solid rgba(18,49,40,0.15)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.2rem', color: '#123128', fontWeight: 800 }}>{totalDistricts || 0}</div>
                <div style={{ color: '#5D665F', fontSize: '0.85rem', textTransform: 'uppercase', marginTop: '0.3rem', fontWeight: 700 }}>Active Districts</div>
              </div>
              <div style={{ padding: '1.5rem', background: '#F5F1E8', borderRadius: '8px', border: '1px solid rgba(18,49,40,0.15)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.2rem', color: '#123128', fontWeight: 800 }}>{totalTalukas || 0}</div>
                <div style={{ color: '#5D665F', fontSize: '0.85rem', textTransform: 'uppercase', marginTop: '0.3rem', fontWeight: 700 }}>Active Talukas</div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className={styles.recentActivity}>
            <div className={styles.cardHeader}>
              <h3>Recent Inquiries</h3>
              <a href="/admin/leads" className={styles.cardLink}>View All →</a>
            </div>
            <ul className={styles.activityList}>
              {recentLeads.length > 0 ? recentLeads.slice(0, 6).map((lead: any) => (
                <li key={lead.id}>
                  <div className={styles.activityAvatar}>{(lead.name || 'L').charAt(0).toUpperCase()}</div>
                  <div className={styles.activityDetails}>
                    <h4>{lead.name}</h4>
                    <p style={{ color: '#4A5568' }}>{lead.phone} • {lead.message?.substring(0, 25)}...</p>
                    <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                  </div>
                  <span className={`${styles.statusBadge} ${lead.status === 'New' ? styles.hot : ''}`}>
                    {lead.status || 'New'}
                  </span>
                </li>
              )) : (
                <li style={{ padding: '1rem', color: '#5D665F', textAlign: 'center' }}>No recent leads found.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
