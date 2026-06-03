'use server';

import { getServiceSupabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
  const supabase = getServiceSupabase();
  
  const settings = {
    id: 1, // Single row
    company_name: formData.get('company_name'),
    phone_number: formData.get('phone_number'),
    whatsapp_number: formData.get('whatsapp_number'),
    email_address: formData.get('email_address'),
    office_address: formData.get('office_address'),
    instagram_url: formData.get('instagram_url'),
    facebook_url: formData.get('facebook_url'),
    youtube_url: formData.get('youtube_url'),
    linkedin_url: formData.get('linkedin_url'),
  };

  const { error } = await supabase.from('site_settings').upsert(settings);
  if (error) throw new Error(error.message);
  
  revalidatePath('/');
  revalidatePath('/admin/settings');
  return { success: true };
}
