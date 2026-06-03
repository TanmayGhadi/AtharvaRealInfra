import { getServiceSupabase } from "@/lib/supabase";
import LeadRow from "./LeadRow";
import styles from "../admin.module.css";

export const revalidate = 0;

export default async function LeadsPage() {
  const adminSupabase = getServiceSupabase();
  const { data: leads, error } = await adminSupabase.from('leads').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <div className={styles.pageHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Lead Management</h1>
      </div>

      <div className={styles.card} style={{ overflowX: 'auto' }}>
        {error ? (
          <p style={{ color: '#f87171' }}>Error loading leads: {error.message}</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--accent-gold)' }}>Name</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--accent-gold)' }}>Contact</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--accent-gold)' }}>Message</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--accent-gold)' }}>Source</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--accent-gold)' }}>Status</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--accent-gold)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads?.map((lead) => (
                <LeadRow key={lead.id} lead={lead} />
              ))}
              {(!leads || leads.length === 0) && (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No leads found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
