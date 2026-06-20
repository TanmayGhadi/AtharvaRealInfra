const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://dtayvrbandikcvucphac.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0YXl2cmJhbmRpa2N2dWNwaGFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDI0MDgxNywiZXhwIjoyMDk1ODE2ODE3fQ.O64JpPfCwq_5L7CgMro9-83QBNAq_PoO3omQJB8YJbc'
);

async function seed() {
  console.log('Seeding data...');
  
  // Properties
  const properties = [
    {
      title: "Luxury Farmhouse Estate",
      description: "Experience the epitome of luxury living amidst nature. This spectacular 5-acre estate offers breathtaking panoramic views of the Sahyadri mountains. Perfectly suited for a grand farmhouse or an eco-resort development.",
      district: "Sindhudurg",
      taluka: "Dodamarg",
      village: "Dodamarg",
      price_display: "₹ 2.5 Cr",
      price_numeric: 25000000,
      area_display: "5 Acres",
      area_sqm: 20234,
      property_type: "Farmhouse",
      status: "Available",
      is_featured: true,
      images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"],
    },
    {
      title: "Premium Agricultural Land",
      description: "Fertile agricultural land perfect for mango or cashew plantation. Excellent water availability and road access.",
      district: "Sindhudurg",
      taluka: "Sawantwadi",
      village: "Sawantwadi",
      price_display: "₹ 1.8 Cr",
      price_numeric: 18000000,
      area_display: "10 Acres",
      area_sqm: 40468,
      property_type: "Agricultural",
      status: "Available",
      is_featured: true,
      images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1332&q=80"],
    },
    {
      title: "Hilltop Sea View Plot",
      description: "Exclusive hilltop plot with stunning Arabian Sea views. Ideal for a luxury villa or boutique resort.",
      district: "Sindhudurg",
      taluka: "Vengurla",
      village: "Vengurla",
      price_display: "₹ 3.2 Cr",
      price_numeric: 32000000,
      area_display: "2 Acres",
      area_sqm: 8093,
      property_type: "Investment",
      status: "Available",
      is_featured: true,
      images: ["https://images.unsplash.com/photo-1613490908575-12052b6653fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"],
    }
  ];

  for (const p of properties) {
    const { error } = await supabase.from('properties').insert(p);
    if (error) console.error('Error inserting property:', error.message);
  }

  // Settings
  const { error: settingsError } = await supabase.from('site_settings').upsert({
    id: 1,
    company_name: 'Atharva Real Infra',
    phone_number: '+91 98765 43210',
    whatsapp_number: '918788818163',
    email_address: 'info@atharvarealinfra.com',
    office_address: 'Sindhudurg, Maharashtra'
  });

  if (settingsError) console.error('Error inserting settings:', settingsError.message);

  console.log('Seeding complete.');
}

seed();
