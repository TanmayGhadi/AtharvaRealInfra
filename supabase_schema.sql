-- ATHARVA REAL INFRA - Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Properties Table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    taluka VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    price_display VARCHAR(50) NOT NULL,
    price_numeric NUMERIC NOT NULL,
    area_display VARCHAR(50) NOT NULL,
    area_sqm NUMERIC,
    property_type VARCHAR(50) NOT NULL, -- Agricultural, Farmhouse, Commercial, Investment
    status VARCHAR(50) DEFAULT 'Available', -- Available, Sold, Reserved
    is_featured BOOLEAN DEFAULT false,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    near_airport BOOLEAN DEFAULT false,
    near_highway BOOLEAN DEFAULT false,
    images JSONB DEFAULT '[]', -- Array of Cloudinary URLs
    videos JSONB DEFAULT '[]',
    documents JSONB DEFAULT '[]',
    nearby_facilities JSONB DEFAULT '[]',
    investment_highlights JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Leads Table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    message TEXT,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'New', -- New, Contacted, Qualified, Closed
    source VARCHAR(50) DEFAULT 'Website',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Blog Posts Table
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    is_published BOOLEAN DEFAULT false,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Site Settings Table (Single row)
CREATE TABLE site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    company_name VARCHAR(255) DEFAULT 'Atharva Real Infra',
    phone_number VARCHAR(50),
    whatsapp_number VARCHAR(50),
    email_address VARCHAR(255),
    office_address TEXT,
    instagram_url VARCHAR(255),
    facebook_url VARCHAR(255),
    youtube_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert default settings row
INSERT INTO site_settings (id, phone_number, whatsapp_number, email_address, office_address) 
VALUES (1, '+91 98765 43210', '919876543210', 'info@atharvarealinfra.com', 'Sindhudurg, Maharashtra')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Properties: public read, admin write
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "properties_public_read" ON properties;
CREATE POLICY "properties_public_read" ON properties
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "properties_admin_all" ON properties;
CREATE POLICY "properties_admin_all" ON properties
  FOR ALL USING (auth.role() = 'service_role');

-- Leads: anyone can insert (website inquiries), only service_role can read/update/delete
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "leads_public_insert" ON leads;
CREATE POLICY "leads_public_insert" ON leads
  FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "leads_admin_all" ON leads;
CREATE POLICY "leads_admin_all" ON leads
  FOR ALL USING (auth.role() = 'service_role');

-- Blog posts: public read of published posts, admin write
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "blog_public_read" ON blog_posts;
CREATE POLICY "blog_public_read" ON blog_posts
  FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "blog_admin_all" ON blog_posts;
CREATE POLICY "blog_admin_all" ON blog_posts
  FOR ALL USING (auth.role() = 'service_role');

-- Site settings: public read, admin write
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "settings_public_read" ON site_settings;
CREATE POLICY "settings_public_read" ON site_settings
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "settings_admin_all" ON site_settings;
CREATE POLICY "settings_admin_all" ON site_settings
  FOR ALL USING (auth.role() = 'service_role');
