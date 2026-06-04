import { MetadataRoute } from 'next';
import { getServiceSupabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.atharvarealinfra.com';

  // Core static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Dynamic location pages (based on primary areas)
  const primaryLocations = [
    'sindhudurg',
    'dodamarg',
    'sawantwadi',
    'vengurla',
    'kudal',
    'kankavli',
  ];

  const locationPages: MetadataRoute.Sitemap = primaryLocations.map((loc) => ({
    url: `${baseUrl}/locations/${loc}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Dynamic property pages
  const supabase = getServiceSupabase();
  const { data: properties } = await supabase
    .from('properties')
    .select('id, updated_at');

  const propertyPages: MetadataRoute.Sitemap = properties
    ? properties.map((prop) => ({
        url: `${baseUrl}/properties/${prop.id}`,
        lastModified: new Date(prop.updated_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))
    : [];

  return [...staticPages, ...locationPages, ...propertyPages];
}
