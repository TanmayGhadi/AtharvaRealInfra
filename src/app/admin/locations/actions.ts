'use server';

import { getServiceSupabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function addVillage(formData: FormData) {
  const taluka_id = formData.get('taluka_id');
  const name = formData.get('name');

  if (!taluka_id || !name) return { error: 'Missing fields' };

  const supabase = getServiceSupabase();
  const { error } = await supabase.from('villages').insert([{ taluka_id, name }]);
  
  if (error) return { error: error.message };
  
  revalidatePath('/admin/locations');
  return { success: true };
}

export async function editVillage(id: string, name: string, taluka_id: string) {
  if (!id || !name || !taluka_id) return { error: 'Missing fields' };

  const supabase = getServiceSupabase();
  const { error } = await supabase.from('villages').update({ name, taluka_id }).eq('id', id);
  
  if (error) return { error: error.message };
  
  revalidatePath('/admin/locations');
  return { success: true };
}

export async function deleteVillage(id: string) {
  if (!id) return { error: 'Missing ID' };

  const supabase = getServiceSupabase();
  const { error } = await supabase.from('villages').delete().eq('id', id);
  
  if (error) return { error: error.message };
  
  revalidatePath('/admin/locations');
  return { success: true };
}
