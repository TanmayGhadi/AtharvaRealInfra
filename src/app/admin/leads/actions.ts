'use server';

import { getServiceSupabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateLeadStatus(id: string, status: string) {
  const supabase = getServiceSupabase();
  const { error } = await supabase.from('leads').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/leads');
}

export async function deleteLead(id: string) {
  const supabase = getServiceSupabase();
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/leads');
}
