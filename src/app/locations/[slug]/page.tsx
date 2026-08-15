import Link from "next/link";
import styles from "./location.module.css";
import { getServiceSupabase } from "@/lib/supabase";
import PropertyCard from "@/components/PropertyCard";
import LocationsSection from "@/components/LocationsSection";
import type { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const locationName = resolvedParams.slug.charAt(0).toUpperCase() + resolvedParams.slug.slice(1);
  return {
    title: `Land & Property Investment in ${locationName} | Atharva Real Infra`,
    description: `Explore premium agricultural land, farmhouses, and NA plots in ${locationName}, Sindhudurg. Verified real estate investments near Goa and Mopa Airport.`,
  };
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const locationName = resolvedParams.slug.charAt(0).toUpperCase() + resolvedParams.slug.slice(1);
  const supabase = getServiceSupabase();
  
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .ilike('taluka', locationName)
    .eq('status', 'Available');

  return (
    <div className={styles.locationPage}>
      <div 
        className={styles.locationHero}
        style={{ backgroundImage: `url('/${resolvedParams.slug.toLowerCase()}.png')` }}
      >
        <div className={styles.heroOverlay}>
          <span className={styles.locationSubtitle}>LOCATION OVERVIEW</span>
          <h1>{locationName}</h1>
          <p>Emerging high-appreciation land investment destination in Sindhudurg</p>
        </div>
      </div>
      
      <div className="section-container">
        <div className="grid-2" style={{ marginBottom: '4rem', alignItems: 'center' }}>
          <div>
            <span className="section-subtitle">Regional Dynamics</span>
            <h2 className="section-title" style={{ textAlign: 'left' }}>Strategic Land Investment in {locationName}</h2>
            <p className="text-muted" style={{ fontSize: '1.02rem', lineHeight: '1.7', marginBottom: '1rem' }}>
              {locationName} offers exceptional long-term land opportunities. With rich natural surroundings, excellent road infrastructure, and seamless access to Mopa International Airport, it has become a preferred destination for investors.
            </p>
            <p className="text-muted" style={{ fontSize: '1.02rem', lineHeight: '1.7' }}>
              Whether you are planning an agricultural estate, a personal retreat, or seeking pure capital appreciation, {locationName} provides clear title land with complete transparency.
            </p>
          </div>
          <div className={styles.statsCard}>
            <h3>{locationName} Highlights</h3>
            <ul>
              <li><span><strong>Appreciation Forecast:</strong></span> <span>25%+ YoY</span></li>
              <li><span><strong>Mopa Airport Access:</strong></span> <span>25 - 45 Mins</span></li>
              <li><span><strong>Highway Connectivity:</strong></span> <span>NH-66 Touch</span></li>
              <li><span><strong>Primary Land Types:</strong></span> <span>Agricultural & NA Plots</span></li>
            </ul>
          </div>
        </div>

        <span className="section-subtitle">Available Opportunities</span>
        <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>Land Listings in {locationName}</h2>
        
        <div className="grid-3">
          {properties && properties.length > 0 ? properties.map((prop: any, idx: number) => (
            <PropertyCard key={prop.id} prop={prop} index={idx} />
          )) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '4rem 2rem', 
              backgroundColor: 'var(--soft-cream, #EDE7DA)',
              borderRadius: '8px',
              border: '1px solid rgba(18, 49, 40, 0.12)'
            }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--primary-forest)', marginBottom: '0.5rem' }}>
                No Active Public Listings in {locationName}
              </h3>
              <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
                Contact our team for off-market land holdings and upcoming parcels in this region.
              </p>
              <Link href="/contact" className="btn-primary">
                Enquire for Off-Market Parcels
              </Link>
            </div>
          )}
        </div>

        {/* More Locations Selector */}
        <LocationsSection activeLocation={locationName} />

        {/* Advisory CTA */}
        <div style={{ 
          marginTop: '5rem', 
          padding: '4rem 2.5rem', 
          backgroundColor: 'var(--deep-forest, #0C241C)', 
          color: '#F7F4EC',
          borderRadius: '10px', 
          textAlign: 'center',
          border: '1px solid rgba(201, 162, 78, 0.3)'
        }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', marginBottom: '1rem', color: '#F7F4EC' }}>
            Interested in {locationName}?
          </h2>
          <p style={{ color: 'rgba(247, 244, 236, 0.8)', marginBottom: '2rem', maxWidth: '640px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
            Our regional land specialists provide site visits, 7/12 title verifications, and personalized guidance for {locationName}.
          </p>
          <Link href="/contact" className="btn-accent">Consult an Advisor</Link>
        </div>
      </div>
    </div>
  );
}
