-- 1. Create States Table
CREATE TABLE states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Districts Table
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    state_id INTEGER REFERENCES states(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(state_id, name)
);

-- 3. Create Talukas Tablecheck i had added

CREATE TABLE talukas (
    id SERIAL PRIMARY KEY,
    district_id INTEGER REFERENCES districts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(district_id, name)
);

-- 4. Create Villages Table
CREATE TABLE villages (
    id SERIAL PRIMARY KEY,
    taluka_id INTEGER REFERENCES talukas(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(taluka_id, name)
);

-- 5. Set up RLS Policies
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE talukas ENABLE ROW LEVEL SECURITY;
ALTER TABLE villages ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Enable read access for all users" ON states FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON districts FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON talukas FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON villages FOR SELECT USING (true);

-- Allow service role to do everything (Supabase handles this automatically usually, but explicitly:)
CREATE POLICY "Enable full access for service role" ON states USING (true) WITH CHECK (true);
CREATE POLICY "Enable full access for service role" ON districts USING (true) WITH CHECK (true);
CREATE POLICY "Enable full access for service role" ON talukas USING (true) WITH CHECK (true);
CREATE POLICY "Enable full access for service role" ON villages USING (true) WITH CHECK (true);

-- 6. Insert Initial Seed Data
INSERT INTO states (name) VALUES ('Maharashtra') ON CONFLICT (name) DO NOTHING;

DO $$
DECLARE
    maharashtra_id INTEGER;
    sindhudurg_id INTEGER;
    ratnagiri_id INTEGER;
    raigad_id INTEGER;
    
    -- Taluka IDs
    sawantwadi_id INTEGER;
    kankavli_id INTEGER;
    dodamarg_id INTEGER;
    devgad_id INTEGER;
    kudal_id INTEGER;
    vengurla_id INTEGER;
    malvan_id INTEGER;
    vaibhavwadi_id INTEGER;
    
    rajapur_id INTEGER;
    mandangad_id INTEGER;
    
    mangaon_id INTEGER;
    roha_id INTEGER;
    shrivardhan_id INTEGER;
BEGIN
    SELECT id INTO maharashtra_id FROM states WHERE name = 'Maharashtra';

    -- Districts
    INSERT INTO districts (state_id, name) VALUES (maharashtra_id, 'Sindhudurg') RETURNING id INTO sindhudurg_id;
    INSERT INTO districts (state_id, name) VALUES (maharashtra_id, 'Ratnagiri') RETURNING id INTO ratnagiri_id;
    INSERT INTO districts (state_id, name) VALUES (maharashtra_id, 'Raigad') RETURNING id INTO raigad_id;

    -- Sindhudurg Talukas
    INSERT INTO talukas (district_id, name) VALUES (sindhudurg_id, 'Sawantwadi') RETURNING id INTO sawantwadi_id;
    INSERT INTO talukas (district_id, name) VALUES (sindhudurg_id, 'Kankavli') RETURNING id INTO kankavli_id;
    INSERT INTO talukas (district_id, name) VALUES (sindhudurg_id, 'Dodamarg') RETURNING id INTO dodamarg_id;
    INSERT INTO talukas (district_id, name) VALUES (sindhudurg_id, 'Devgad') RETURNING id INTO devgad_id;
    INSERT INTO talukas (district_id, name) VALUES (sindhudurg_id, 'Kudal') RETURNING id INTO kudal_id;
    INSERT INTO talukas (district_id, name) VALUES (sindhudurg_id, 'Vengurla') RETURNING id INTO vengurla_id;
    INSERT INTO talukas (district_id, name) VALUES (sindhudurg_id, 'Malvan') RETURNING id INTO malvan_id;
    INSERT INTO talukas (district_id, name) VALUES (sindhudurg_id, 'Vaibhavwadi') RETURNING id INTO vaibhavwadi_id;

    -- Ratnagiri Talukas
    INSERT INTO talukas (district_id, name) VALUES (ratnagiri_id, 'Rajapur') RETURNING id INTO rajapur_id;
    INSERT INTO talukas (district_id, name) VALUES (ratnagiri_id, 'Mandangad') RETURNING id INTO mandangad_id;

    -- Raigad Talukas
    INSERT INTO talukas (district_id, name) VALUES (raigad_id, 'Mangaon') RETURNING id INTO mangaon_id;
    INSERT INTO talukas (district_id, name) VALUES (raigad_id, 'Roha') RETURNING id INTO roha_id;
    INSERT INTO talukas (district_id, name) VALUES (raigad_id, 'Shrivardhan') RETURNING id INTO shrivardhan_id;

    -- Insert Sample Villages
    
    -- Kudal Villages
    INSERT INTO villages (taluka_id, name) VALUES 
        (kudal_id, 'Kasal'), (kudal_id, 'Pinguli'), (kudal_id, 'Oros'), (kudal_id, 'Nerur'), 
        (kudal_id, 'Walawal'), (kudal_id, 'Humarmala'), (kudal_id, 'Bambuli');
        
    -- Sawantwadi Villages
    INSERT INTO villages (taluka_id, name) VALUES 
        (sawantwadi_id, 'Charathe'), (sawantwadi_id, 'Madkhol'), (sawantwadi_id, 'Amboli'), 
        (sawantwadi_id, 'Shiroda'), (sawantwadi_id, 'Sangeli'), (sawantwadi_id, 'Satarda');
        
    -- Kankavli Villages
    INSERT INTO villages (taluka_id, name) VALUES 
        (kankavli_id, 'Nandgaon'), (kankavli_id, 'Osargaon'), (kankavli_id, 'Harkul'), 
        (kankavli_id, 'Talere'), (kankavli_id, 'Phondaghat');
        
    -- Vengurla Villages
    INSERT INTO villages (taluka_id, name) VALUES 
        (vengurla_id, 'Shiroda'), (vengurla_id, 'Mochemad'), (vengurla_id, 'Redi'), 
        (vengurla_id, 'Ubhadanda'), (vengurla_id, 'Parule');
        
    -- Dodamarg Villages
    INSERT INTO villages (taluka_id, name) VALUES 
        (dodamarg_id, 'Tilari'), (dodamarg_id, 'Kudase'), (dodamarg_id, 'Zolambe'), (dodamarg_id, 'Kasai');
        
    -- Devgad Villages
    INSERT INTO villages (taluka_id, name) VALUES 
        (devgad_id, 'Mithmumbari'), (devgad_id, 'Jamsande'), (devgad_id, 'Pombhurle'), (devgad_id, 'Wada');
        
    -- Malvan Villages
    INSERT INTO villages (taluka_id, name) VALUES 
        (malvan_id, 'Achara'), (malvan_id, 'Tarkarli'), (malvan_id, 'Kolamb'), (malvan_id, 'Chivla');
        
    -- Vaibhavwadi Villages
    INSERT INTO villages (taluka_id, name) VALUES 
        (vaibhavwadi_id, 'Napane'), (vaibhavwadi_id, 'Nadhavade'), (vaibhavwadi_id, 'Karul');
        
    -- Rajapur Villages
    INSERT INTO villages (taluka_id, name) VALUES 
        (rajapur_id, 'Dhaulvali'), (rajapur_id, 'Pachal'), (rajapur_id, 'Oni');
        
    -- Mandangad Villages
    INSERT INTO villages (taluka_id, name) VALUES 
        (mandangad_id, 'Palgad'), (mandangad_id, 'Adkhal'), (mandangad_id, 'Ladghar');
        
    -- Mangaon Villages
    INSERT INTO villages (taluka_id, name) VALUES 
        (mangaon_id, 'Nizampur'), (mangaon_id, 'Goregaon');
        
    -- Roha Villages
    INSERT INTO villages (taluka_id, name) VALUES 
        (roha_id, 'Kolad'), (roha_id, 'Pugaon');
        
    -- Shrivardhan Villages
    INSERT INTO villages (taluka_id, name) VALUES 
        (shrivardhan_id, 'Harihareshwar'), (shrivardhan_id, 'Diveagar');

END $$;
