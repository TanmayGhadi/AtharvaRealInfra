import { getServiceSupabase } from "@/lib/supabase";
import LocationManager from "./LocationManager";
import styles from "../admin.module.css";

export const revalidate = 0;

export default async function LocationsPage() {
  const supabase = getServiceSupabase();

  // Fetch full hierarchy
  const { data: districts } = await supabase.from('districts').select('*').order('name');
  const { data: talukas } = await supabase.from('talukas').select('*, districts(name)').order('name');
  const { data: villages } = await supabase.from('villages').select('*, talukas(name, district_id)').order('name');

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsHeader} style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className={styles.title}>Location Master System</h1>
          <p className={styles.subtitle}>Manage Districts, Talukas, and Villages</p>
        </div>
      </div>

      <LocationManager 
        districts={districts || []} 
        talukas={talukas || []} 
        villages={villages || []} 
      />
    </div>
  );
}
