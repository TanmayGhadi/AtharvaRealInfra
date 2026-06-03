import styles from "../admin.module.css";

export default function AdminMediaPage() {
  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <div>
          <h1>Media Library</h1>
          <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Manage all images, videos, and documents for your properties.</p>
        </div>
        <button className="btn-primary">+ Upload Media</button>
      </div>

      <div className={styles.chartCard}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
          <button style={{ background: 'var(--accent-gold)', color: 'black', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 'bold' }}>All Media</button>
          <button style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>Images</button>
          <button style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>Videos</button>
          <button style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>Documents</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} style={{ background: 'var(--bg-primary)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <div style={{ height: '150px', backgroundImage: `url('/banner%201.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div style={{ padding: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>banner_{item}.png</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>1.2 MB</span>
                  <button style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
