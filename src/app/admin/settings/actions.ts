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
    logo_url: formData.get('logo_url'),
    seo_title: formData.get('seo_title'),
    seo_description: formData.get('seo_description'),
  };

  const { error } = await supabase.from('site_settings').upsert(settings);
  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(error.message);
  }
  
  revalidatePath('/', 'layout');
  return { success: true };
}
