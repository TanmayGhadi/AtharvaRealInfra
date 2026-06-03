const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) env[key.trim()] = val.join('=').trim().replace(/['"]/g, '');
});

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await admin.from('properties').select('*').limit(1);
  if (error) {
    console.log('Error fetching properties:', error);
  } else if (data && data.length > 0) {
    console.log('Properties columns:', Object.keys(data[0]));
  } else {
    console.log('Properties table is empty, trying to insert a dummy row to test schema...');
    const { error: insErr } = await admin.from('properties').insert({
      title: 'Test',
      district: 'Sindhudurg',
      is_featured: true,
      status: 'Available'
    });
    console.log('Insert test result:', insErr ? insErr.message : 'Success');
  }
}

run();
