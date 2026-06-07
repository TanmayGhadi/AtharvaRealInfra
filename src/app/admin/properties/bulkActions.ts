'use server';

import { getServiceSupabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function processBulkUpload(properties: any[]) {
  const supabase = getServiceSupabase();
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[]
  };

  for (let i = 0; i < properties.length; i++) {
    const p = properties[i];
    try {
      // Basic validation
      if (!p.title || !p.district || !p.taluka || !p.price_display || !p.price_numeric) {
        throw new Error(`Row ${i + 1}: Missing required fields (Title, District, Taluka, Price)`);
      }

      // Prepare images
      let images = [];
      let videos = [];
      let thumbnail = p.thumbnail_image || null;

      if (p.gallery_urls) {
        images = p.gallery_urls.split(',').map((url: string) => url.trim()).filter((url: string) => url);
        if (images.length > 0 && !thumbnail) thumbnail = images[0];
      } else if (p.cover_image_url) {
        images = [p.cover_image_url];
        thumbnail = p.cover_image_url;
      }

      if (p.video_urls) {
        videos = p.video_urls.split(',').map((url: string) => url.trim()).filter((url: string) => url);
      }

      const propertyData = {
        title: p.title,
        description: p.description || '',
        district: p.district,
        taluka: p.taluka,
        village: p.village || '',
        price_display: p.price_display,
        price_numeric: Number(p.price_numeric) || 0,
        area_display: p.area_display || '',
        area_sqm: Number(p.area_sqm) || 0,
        property_type: p.property_type || 'Agricultural',
        status: p.status || 'Available',
        is_featured: p.is_featured === 'true' || p.is_featured === true || p.is_featured === 'TRUE' || p.is_featured === 'Yes',
        latitude: p.latitude ? Number(p.latitude) : null,
        longitude: p.longitude ? Number(p.longitude) : null,
        thumbnail_image: thumbnail,
        images: images,
        videos: videos
      };

      if (p.id) {
        // Update existing
        const { error } = await supabase.from('properties').update(propertyData).eq('id', p.id);
        if (error) throw new Error(`Row ${i + 1} Update Error: ${error.message}`);
      } else {
        // Insert new
        const { error } = await supabase.from('properties').insert([propertyData]);
        if (error) throw new Error(`Row ${i + 1} Insert Error: ${error.message}`);
      }

      results.success++;
    } catch (err: any) {
      results.failed++;
      results.errors.push(err.message || String(err));
    }
  }

  revalidatePath('/');
  revalidatePath('/properties');
  revalidatePath('/admin/properties');

  return results;
}
