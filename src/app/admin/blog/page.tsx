import styles from "../admin.module.css";

export default function AdminBlogPage() {
  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <div>
          <h1>Blog Management</h1>
          <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Write and publish articles to improve SEO and engage visitors.</p>
        </div>
        <button className="btn-primary">+ Create New Post</button>
      </div>

      <div className={styles.chartCard} style={{ overflowX: 'auto', padding: 0 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className={styles.search}>
            <input type="text" placeholder="Search posts..." />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select className={styles.chartSelect}>
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.2)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>Post Title</th>
              <th style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)' }}>Author</th>
              <th style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)' }}>Date</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Status & Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="hover-bg-light">
              <td style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.25rem' }}>Why Sindhudurg is the Next Big Real Estate Hub</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>/blog/why-sindhudurg-next-hub</div>
              </td>
              <td style={{ padding: '1.25rem 1rem' }}>Admin</td>
              <td style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)' }}>June 3, 2026</td>
              <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <span style={{ padding: '0.25rem 0.5rem', background: 'rgba(74,222,128,0.1)', color: '#4ade80', borderRadius: '4px', fontSize: '0.75rem', marginRight: '0.5rem' }}>Published</span>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}>✏️</button>
                  <button style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.25rem' }}>🗑️</button>
                </div>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="hover-bg-light">
              <td style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.25rem' }}>Top 5 Things to Check Before Buying Agricultural Land</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>/blog/top-5-things-to-check</div>
              </td>
              <td style={{ padding: '1.25rem 1rem' }}>Admin</td>
              <td style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)' }}>Draft</td>
              <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <span style={{ padding: '0.25rem 0.5rem', background: 'rgba(251,191,36,0.1)', color: '#fbbf24', borderRadius: '4px', fontSize: '0.75rem', marginRight: '0.5rem' }}>Draft</span>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}>✏️</button>
                  <button style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.25rem' }}>🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
