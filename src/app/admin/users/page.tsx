import styles from "../admin.module.css";

export default function AdminUsersPage() {
  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <div>
          <h1>Admin Users</h1>
          <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Manage team members and access permissions.</p>
        </div>
        <button className="btn-primary">+ Add New User</button>
      </div>

      <div className={styles.chartCard} style={{ overflowX: 'auto', padding: 0 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className={styles.search}>
            <input type="text" placeholder="Search users by name or email..." />
          </div>
          <select className={styles.chartSelect}>
            <option value="">All Roles</option>
            <option value="admin">Administrator</option>
            <option value="editor">Editor</option>
            <option value="agent">Agent</option>
          </select>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.2)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>User Details</th>
              <th style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)' }}>Role</th>
              <th style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)' }}>Last Active</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="hover-bg-light">
              <td style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(212,175,55,0.2)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AD</div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>Admin User</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>admin@atharvarealinfra.com</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: '1.25rem 1rem' }}>
                <span style={{ padding: '0.25rem 0.5rem', background: 'rgba(74,222,128,0.1)', color: '#4ade80', borderRadius: '4px', fontSize: '0.8rem' }}>Super Admin</span>
              </td>
              <td style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)' }}>Just now</td>
              <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'not-allowed', padding: '0.5rem' }}>Primary Admin</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
