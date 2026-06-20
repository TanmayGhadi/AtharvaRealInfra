'use server';

import { getServiceSupabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getProperty(id: string) {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
  if (error) {
    console.error("Error fetching property:", error);
    return null;
  }
  return data;
}

export async function getLocations() {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase.from('villages').select('name, talukas(name, districts(name))');
  if (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
  return data;
}

export async function createProperty(formData: FormData) {
  const supabase = getServiceSupabase();
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const district = formData.get('district') as string;
  const taluka = formData.get('taluka') as string;
  const village = formData.get('village') as string;
  const price_display = formData.get('price_display') as string;
  const price_numeric = parseFloat(formData.get('price_numeric') as string) || 0;
  const area_display = formData.get('area_display') as string;
  const area_sqm = parseFloat(formData.get('area_sqm') as string) || 0;
  const property_type = formData.get('property_type') as string;
  const status = formData.get('status') as string;
  const is_featured = formData.get('is_featured') === 'on';
  const latitude = parseFloat(formData.get('latitude') as string) || null;
  const longitude = parseFloat(formData.get('longitude') as string) || null;
  
  const slug = formData.get('slug') as string || null;
  const seo_title = formData.get('seo_title') as string || null;
  const seo_description = formData.get('seo_description') as string || null;
  const seo_keywords = formData.get('seo_keywords') as string || null;
  const thumbnail_image = formData.get('thumbnail_image') as string || null;
  
  const amenitiesJson = formData.get('amenities') as string;
  const amenities = amenitiesJson ? JSON.parse(amenitiesJson) : [];
  
  const imagesJson = formData.get('images') as string;
  const images = imagesJson ? JSON.parse(imagesJson) : [];
  
  const videosJson = formData.get('videos') as string;
  const videos = videosJson ? JSON.parse(videosJson) : [];
  
  const documentsJson = formData.get('documents') as string;
  const documents = documentsJson ? JSON.parse(documentsJson) : [];

  // Base columns that are confirmed to exist in the database
  const baseInsertData: Record<string, any> = {
    title,
    description,
    district,
    taluka,
    village,
    price_display,
    price_numeric,
    area_display,
    area_sqm,
    property_type,
    status,
    is_featured,
    latitude,
    longitude,
    images,
    videos,
    documents
  };

  // Extended data with SEO fields (available after running the SQL migration)
  const extendedInsertData = {
    ...baseInsertData,
    ...(slug ? { slug } : {}),
    ...(seo_title ? { seo_title } : {}),
    ...(seo_description ? { seo_description } : {}),
    ...(seo_keywords ? { seo_keywords } : {}),
    ...(thumbnail_image ? { thumbnail_image } : {}),
    ...(amenities?.length > 0 ? { amenities } : {}),
  };

  // Try with all fields first, fall back to base fields if SEO columns don't exist
  let { data, error } = await supabase.from('properties').insert(extendedInsertData).select();
  
  if (error && error.message.includes('does not exist')) {
    console.warn('SEO columns not found in DB, saving without SEO fields. Run the SQL migration to enable SEO fields.');
    const result2 = await supabase.from('properties').insert(baseInsertData).select();
    error = result2.error;
    data = result2.data;
  }

  if (error) {
    console.error("Error creating property:", error);
    if (error.code === '23505' && error.message.includes('slug')) {
      return { success: false, error: "A property with this SEO slug already exists. Please choose a unique slug." };
    }
    return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true, id: data?.[0]?.id };
}

export async function deleteProperty(id: string) {
  const supabase = getServiceSupabase();
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) {
    console.error("Error deleting property:", error);
    throw new Error(error.message);
  }
  revalidatePath('/', 'layout');
}

export async function updatePropertyStatus(id: string, status: string) {
  const supabase = getServiceSupabase();
  const { error } = await supabase.from('properties').update({ status }).eq('id', id);
  if (error) {
    console.error("Error updating property status:", error);
    throw new Error(error.message);
  }
  revalidatePath('/', 'layout');
}

export async function updateProperty(id: string, formData: FormData) {
  const supabase = getServiceSupabase();
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const district = formData.get('district') as string;
  const taluka = formData.get('taluka') as string;
  const village = formData.get('village') as string;
  const price_display = formData.get('price_display') as string;
  const price_numeric = parseFloat(formData.get('price_numeric') as string) || 0;
  const area_display = formData.get('area_display') as string;
  const area_sqm = parseFloat(formData.get('area_sqm') as string) || 0;
  const property_type = formData.get('property_type') as string;
  const status = formData.get('status') as string;
  const is_featured = formData.get('is_featured') === 'on';
  const latitude = parseFloat(formData.get('latitude') as string) || null;
  const longitude = parseFloat(formData.get('longitude') as string) || null;

  console.log("UPDATE PROPERTY CALLED! ID:", id);
  console.log("TITLE RECEIVED:", title, "PRICE:", price_numeric);

  const slug = formData.get('slug') as string || null;
  const seo_title = formData.get('seo_title') as string || null;
  const seo_description = formData.get('seo_description') as string || null;
  const seo_keywords = formData.get('seo_keywords') as string || null;
  const thumbnail_image = formData.get('thumbnail_image') as string || null;
  
  const amenitiesJson = formData.get('amenities') as string;
  const amenities = amenitiesJson ? JSON.parse(amenitiesJson) : [];
  
  const imagesJson = formData.get('images') as string;
  const images = imagesJson ? JSON.parse(imagesJson) : [];
  
  const videosJson = formData.get('videos') as string;
  const videos = videosJson ? JSON.parse(videosJson) : [];
  
  const documentsJson = formData.get('documents') as string;
  const documents = documentsJson ? JSON.parse(documentsJson) : [];

  // Base update data — confirmed to exist in the database
  const baseUpdateData: Record<string, any> = {
    title,
    description,
    district,
    taluka,
    village,
    price_display,
    price_numeric,
    area_display,
    area_sqm,
    property_type,
    status,
    is_featured,
    latitude,
    longitude,
    images,
    videos,
    documents
  };

  // Extended data with SEO fields (available after running the SQL migration)
  const extendedUpdateData = {
    ...baseUpdateData,
    slug: slug || null,
    seo_title: seo_title || null,
    seo_description: seo_description || null,
    seo_keywords: seo_keywords || null,
    thumbnail_image: thumbnail_image || null,
    amenities,
  };

  // Try with all fields first, fall back to base fields if SEO columns don't exist yet
  let { error } = await supabase.from('properties').update(extendedUpdateData).eq('id', id);

  if (error && error.message.includes('does not exist')) {
    console.warn('SEO columns not found in DB, saving without SEO fields. Run the SQL migration to enable SEO fields.');
    const result2 = await supabase.from('properties').update(baseUpdateData).eq('id', id);
    error = result2.error;
  }

  if (error) {
    console.error("Error updating property:", error);
    if (error.code === '23505' && error.message.includes('slug')) {
      return { success: false, error: "A property with this SEO slug already exists. Please choose a unique slug." };
    }
    return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  
  return { success: true };
}
