-- ================================================
-- MIGRATION: Add missing columns to properties table
-- 
-- RUN THIS IN SUPABASE SQL EDITOR:
-- https://supabase.com/dashboard/project/dtayvrbandikcvucphac/sql/new
--
-- After running this migration:
--   - Property editing will save SEO fields (slug, seo_title, etc.)
--   - Thumbnail images will be saved
--   - Amenities will be saved
-- ================================================

-- Add SEO & metadata columns
ALTER TABLE properties ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS seo_keywords TEXT;

-- Add media column
ALTER TABLE properties ADD COLUMN IF NOT EXISTS thumbnail_image TEXT;

-- Add amenities column
ALTER TABLE properties ADD COLUMN IF NOT EXISTS amenities JSONB DEFAULT '[]';

-- Reload PostgREST schema cache so the new columns are immediately accessible
NOTIFY pgrst, 'reload schema';

-- Verify the columns were added successfully
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'properties'
  AND column_name IN ('slug', 'seo_title', 'seo_description', 'seo_keywords', 'thumbnail_image', 'amenities')
ORDER BY column_name;
