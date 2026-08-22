'use server';

import { getServiceSupabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

function isValidUUID(uuidStr: string): boolean {
  if (!uuidStr || typeof uuidStr !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuidStr.trim());
}

function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
}

export async function processBulkUpload(properties: any[]) {
  const supabase = getServiceSupabase();
  const results = {
    success: 0,
    failed: 0,
    errors: [] as { row: number; title: string; error: string }[]
  };

  for (let i = 0; i < properties.length; i++) {
    const p = properties[i];
    const rowNum = p._rowIndex || (i + 1);
    const propertyTitle = p.title || `Row ${rowNum}`;

    try {
      // Validate required fields
      if (!p.title || !p.title.trim()) {
        throw new Error(`Title is required.`);
      }
      if (!p.district || !p.district.trim()) {
        throw new Error(`District is required.`);
      }
      if (!p.taluka || !p.taluka.trim()) {
        throw new Error(`Taluka is required.`);
      }
      if (!p.price_display || !p.price_display.trim()) {
        throw new Error(`Price Display is required.`);
      }
      if (p.price_numeric === undefined || p.price_numeric === null || isNaN(Number(p.price_numeric))) {
        throw new Error(`Price Numeric must be a valid number.`);
      }

      // Process gallery, cover image & videos
      let images: string[] = [];
      let videos: string[] = [];
      let thumbnail: string | null = p.thumbnail_image || p.cover_image_url || null;

      if (p.gallery_urls && typeof p.gallery_urls === 'string') {
        images = p.gallery_urls.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
      } else if (Array.isArray(p.images)) {
        images = p.images;
      }

      if (p.cover_image_url && typeof p.cover_image_url === 'string' && p.cover_image_url.trim()) {
        if (!images.includes(p.cover_image_url.trim())) {
          images.unshift(p.cover_image_url.trim());
        }
        if (!thumbnail) thumbnail = p.cover_image_url.trim();
      }

      if (images.length > 0 && !thumbnail) {
        thumbnail = images[0];
      }

      if (p.video_urls && typeof p.video_urls === 'string') {
        videos = p.video_urls.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
      } else if (Array.isArray(p.videos)) {
        videos = p.videos;
      }

      const generatedSlug = slugify(p.slug || p.title);
      const isFeatured = p.is_featured === true || p.is_featured === 'true' || p.is_featured === 'TRUE' || p.is_featured === 'Yes' || p.is_featured === 'yes' || p.is_featured === 1;

      const propertyData: any = {
        title: p.title.trim(),
        description: p.description ? p.description.trim() : '',
        district: p.district.trim(),
        taluka: p.taluka.trim(),
        village: p.village ? p.village.trim() : '',
        price_display: p.price_display.trim(),
        price_numeric: Number(p.price_numeric),
        area_display: p.area_display ? p.area_display.trim() : '',
        area_sqm: p.area_sqm !== undefined && p.area_sqm !== null && !isNaN(Number(p.area_sqm)) ? Number(p.area_sqm) : 0,
        property_type: p.property_type ? p.property_type.trim() : 'Agricultural Land',
        status: p.status ? p.status.trim() : 'Available',
        is_featured: isFeatured,
        latitude: p.latitude && !isNaN(Number(p.latitude)) ? Number(p.latitude) : null,
        longitude: p.longitude && !isNaN(Number(p.longitude)) ? Number(p.longitude) : null,
        thumbnail_image: thumbnail,
        images: images,
        videos: videos,
        slug: generatedSlug,
        seo_title: p.seo_title || `${p.title.trim()} in ${p.district.trim()} | Atharva Real Infra`,
        seo_description: p.seo_description || p.description || '',
        seo_keywords: p.seo_keywords || `property, land, ${p.district}, ${p.taluka}, maharashtra real estate`
      };

      // Check if id in Excel is a valid UUID for update, otherwise let Supabase auto-generate UUID primary key
      if (p.id && isValidUUID(p.id)) {
        const { error } = await supabase.from('properties').update(propertyData).eq('id', p.id.trim());
        if (error) throw new Error(`DB Update Error: ${error.message}`);
      } else {
        const { error } = await supabase.from('properties').insert([propertyData]);
        if (error) throw new Error(`DB Insert Error: ${error.message}`);
      }

      results.success++;
    } catch (err: any) {
      results.failed++;
      results.errors.push({
        row: rowNum,
        title: propertyTitle,
        error: err.message || String(err)
      });
    }
  }

  revalidatePath('/admin/properties');
  revalidatePath('/properties');
  revalidatePath('/');

  return results;
}
