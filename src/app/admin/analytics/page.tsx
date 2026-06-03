import styles from "../admin.module.css";
import { getServiceSupabase } from "@/lib/supabase";

export default async function AdminAnalyticsPage() {
  const adminSupabase = getServiceSupabase();
  const { data: properties } = await adminSupabase.from('properties').select('id, title').limit(5);
  const recentProperties = properties || [];

  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <div>
          <h1>Analytics & Reports</h1>
          <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Detailed insights into website traffic, lead conversions, and property views.</p>
        </div>
        <select className={styles.chartSelect}>
          <option>Last 30 Days</option>
          <option>This Quarter</option>
          <option>This Year</option>
          <option>All Time</option>
        </select>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👁️</div>
          <div className={styles.statContent}>
            <h3>Total Page Views</h3>
            <div className={styles.statValue}>0</div>
            <div className={styles.statChange} style={{ color: 'var(--text-secondary)' }}>Awaiting traffic data</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3>Unique Visitors</h3>
            <div className={styles.statValue}>0</div>
            <div className={styles.statChange} style={{ color: 'var(--text-secondary)' }}>Awaiting traffic data</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📈</div>
          <div className={styles.statContent}>
            <h3>Conversion Rate</h3>
            <div className={styles.statValue}>0.0%</div>
            <div className={styles.statChange} style={{ color: 'var(--text-secondary)' }}>Awaiting lead data</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏱️</div>
          <div className={styles.statContent}>
            <h3>Avg. Session</h3>
            <div className={styles.statValue}>0m 0s</div>
            <div className={styles.statChange} style={{ color: 'var(--text-secondary)' }}>Awaiting traffic data</div>
          </div>
        </div>
      </div>

      <div className={styles.dashboardGrid} style={{ marginTop: '2rem' }}>
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3>Traffic Overview</h3>
          </div>
          <div className={styles.chartPlaceholder} style={{ height: '400px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)'}}>
              <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</span>
              Traffic Chart Visualization Ready
            </div>
          </div>
        </div>
        
        <div className={styles.recentActivity}>
          <div className={styles.cardHeader}>
            <h3>Top Viewed Properties</h3>
          </div>
          <ul className={styles.activityList}>
            {recentProperties.length > 0 ? recentProperties.map((prop, i) => (
              <li key={prop.id} style={{ alignItems: 'center' }}>
                <div style={{ width: '30px', height: '30px', background: 'rgba(212,175,55,0.1)', color: 'var(--accent-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{i + 1}</div>
                <div className={styles.activityDetails}>
                  <h4 style={{ fontSize: '0.9rem' }}>{prop.title}</h4>
                  <p style={{ margin: 0, color: 'var(--accent-gold)', fontWeight: 'bold' }}>0 views</p>
                </div>
              </li>
            )) : (
              <li style={{ padding: '1rem', color: 'var(--text-secondary)' }}>No properties added yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
