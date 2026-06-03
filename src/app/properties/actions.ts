'use server';

import { getServiceSupabase } from "@/lib/supabase";

export async function submitLead(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const message = formData.get('message') as string;
  const property_id = formData.get('property_id') as string;

  // Use service role to bypass RLS — this is a trusted server action
  const adminSupabase = getServiceSupabase();

  const { error } = await adminSupabase.from('leads').insert({
    name,
    email,
    phone,
    message,
    property_id: property_id || null,
    source: 'Website Inquiry'
  });

  if (error) {
    console.error("Error submitting lead:", error);
    return { success: false, error: "Failed to submit inquiry. Please try again." };
  }

  return { success: true };
}
