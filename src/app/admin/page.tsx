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
  
  // Calculate total revenue from sold properties
  const totalRevenue = allProperties
    .filter(p => p.status === 'Sold')
    .reduce((acc, curr) => acc + (curr.price_numeric || 0), 0);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹ ${(val / 100000).toFixed(2)} Lacs`;
    return `₹ ${val.toLocaleString('en-IN')}`;
  };

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
          <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Welcome back to your premium property management system.</p>
        </div>
        <button className="btn-primary">Download Report</button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏢</div>
          <div className={styles.statContent}>
            <h3>Total Properties</h3>
            <div className={styles.statValue}>{totalProperties}</div>
            <div className={styles.statChange + " " + styles.positive}>{availableProperties} Active Listings</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statContent}>
            <h3>Featured</h3>
            <div className={styles.statValue}>{featuredProperties}</div>
            <div className={styles.statChange + " " + styles.positive}>Premium placements</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🤝</div>
          <div className={styles.statContent}>
            <h3>Sold/Reserved</h3>
            <div className={styles.statValue}>{soldProperties + reservedProperties}</div>
            <div className={styles.statChange + " " + styles.positive}>{soldProperties} Sold | {reservedProperties} Reserved</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📈</div>
          <div className={styles.statContent}>
            <h3>Total Leads</h3>
            <div className={styles.statValue}>{totalLeads || 0}</div>
            <div className={styles.statChange + " " + styles.positive}>From website inquiries</div>
          </div>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.mainColumn}>
          <div className={styles.chartCard} style={{ marginBottom: '1.5rem' }}>
            <div className={styles.cardHeader}>
              <h3>Lead Analytics</h3>
              <select className={styles.chartSelect}>
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Year</option>
              </select>
            </div>
            <div className={styles.chartPlaceholder}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)'}}>
                <span style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</span>
                System Active & Monitoring Leads
              </div>
            </div>
          </div>
          
          <div className={styles.chartCard}>
            <div className={styles.cardHeader}>
              <h3>Location Statistics</h3>
              <a href="/admin/locations" className={styles.cardLink}>Manage Locations</a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', color: 'var(--accent-gold)', fontWeight: 'bold' }}>{totalDistricts || 0}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', marginTop: '0.5rem' }}>Districts</div>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', color: 'var(--accent-gold)', fontWeight: 'bold' }}>{totalTalukas || 0}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', marginTop: '0.5rem' }}>Talukas</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.sideColumn}>
          <div className={styles.recentActivity}>
            <div className={styles.cardHeader}>
              <h3>Recent Inquiries</h3>
              <a href="/admin/leads" className={styles.cardLink}>View All</a>
            </div>
            <ul className={styles.activityList}>
              {recentLeads.length > 0 ? recentLeads.slice(0, 6).map((lead: any) => (
                <li key={lead.id}>
                  <div className={styles.activityAvatar}>{lead.name.charAt(0).toUpperCase()}</div>
                  <div className={styles.activityDetails}>
                    <h4>{lead.name}</h4>
                    <p>{lead.phone} • {lead.message?.substring(0, 30)}...</p>
                    <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                  </div>
                  <span className={`${styles.statusBadge} ${lead.status === 'New' ? styles.hot : ''}`}>
                    {lead.status || 'New'}
                  </span>
                </li>
              )) : (
                <li style={{ padding: '1rem', color: 'var(--text-secondary)' }}>No leads generated yet.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
