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

  const { data, error } = await supabase.from('properties').insert({
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
    slug,
    seo_title,
    seo_description,
    seo_keywords,
    thumbnail_image,
    amenities,
    images,
    videos,
    documents
  }).select();

  if (error) {
    console.error("Error creating property:", error);
    throw new Error(error.message);
  }

  revalidatePath('/');
  revalidatePath('/properties');
  revalidatePath('/admin/properties');
  redirect('/admin/properties');
}

export async function deleteProperty(id: string) {
  const supabase = getServiceSupabase();
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) {
    console.error("Error deleting property:", error);
    throw new Error(error.message);
  }
  revalidatePath('/');
  revalidatePath('/properties');
  revalidatePath('/admin/properties');
}

export async function updatePropertyStatus(id: string, status: string) {
  const supabase = getServiceSupabase();
  const { error } = await supabase.from('properties').update({ status }).eq('id', id);
  if (error) {
    console.error("Error updating property status:", error);
    throw new Error(error.message);
  }
  revalidatePath('/properties');
  revalidatePath('/admin/properties');
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

  const { error } = await supabase.from('properties').update({
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
    slug,
    seo_title,
    seo_description,
    seo_keywords,
    thumbnail_image,
    amenities,
    images,
    videos,
    documents
  }).eq('id', id);

  if (error) {
    console.error("Error updating property:", error);
    throw new Error(error.message);
  }

  revalidatePath('/');
  revalidatePath('/properties');
  revalidatePath('/admin/properties');
  redirect('/admin/properties');
}
