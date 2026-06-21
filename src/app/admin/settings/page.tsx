import { getServiceSupabase } from "@/lib/supabase";
import SettingsForm from "./SettingsForm";
import styles from "../admin.module.css";

export const revalidate = 0;

export default async function SettingsPage() {
  const supabase = getServiceSupabase();
  const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 1).single();

  return (
    <div>
      <div className={styles.pageHeader} style={{ marginBottom: '2rem' }}>
        <h1>Global Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your company information, social links, and global configuration.</p>
      </div>

      <SettingsForm initialData={settings} />
    </div>
  );
}
