import Link from "next/link";
import homeStyles from "../../page.module.css";
import styles from "./location.module.css";
import { getServiceSupabase } from "@/lib/supabase";
import PropertyCard from "@/components/PropertyCard";

import type { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const locationName = resolvedParams.slug.charAt(0).toUpperCase() + resolvedParams.slug.slice(1);
  return {
    title: `Land & Property Investment in ${locationName}`,
    description: `Explore premium agricultural plots, farm land for sale, and NA plots in ${locationName}. Secure your real estate investment near Goa and Mopa Airport with Atharva Real Infra.`,
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
          <h1>{locationName}</h1>
          <p>The emerging hub of luxury real estate in Sindhudurg</p>
        </div>
      </div>
      
      <div className="section-container">
        <div className="grid-2" style={{marginBottom: '4rem'}}>
          <div>
            <h2 className="section-title" style={{textAlign: 'left'}}>Area Overview</h2>
            <p className="mb-2" style={{fontSize: '1.1rem', lineHeight: '1.8'}}>
              {locationName} is rapidly transforming into a prime investment destination. Known for its lush green landscapes, serene environment, and proximity to major infrastructure projects, it offers the perfect blend of natural beauty and modern connectivity.
            </p>
            <p style={{fontSize: '1.1rem', lineHeight: '1.8'}}>
              Whether you are looking to build a luxurious private estate, a boutique resort, or simply seeking high-return land investments, {locationName} provides unparalleled opportunities with clear titles and seamless acquisition processes.
            </p>
          </div>
          <div className={styles.statsCard}>
            <h3>Investment Potential</h3>
            <ul>
              <li><strong>Avg Appreciation:</strong> 25% YoY</li>
              <li><strong>Proximity to Airport:</strong> 30 Mins</li>
              <li><strong>Infrastructure:</strong> Upcoming Highway Touch</li>
              <li><strong>Suitability:</strong> Farmhouses, Resorts, Agriculture</li>
            </ul>
          </div>
        </div>

        <h2 className="section-title">Available Properties in {locationName}</h2>
        <div className="grid-3">
          {properties && properties.length > 0 ? properties.map((prop: any, idx: number) => (
            <PropertyCard key={prop.id} prop={prop} index={idx} />
          )) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No properties currently available in {locationName}. Please check back later or contact us for off-market listings.
            </p>
          )}
        </div>

        {/* Contact CTA */}
        <div style={{ marginTop: '5rem', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Interested in {locationName}?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Our advisors have exclusive off-market properties and deep insights into the {locationName} region. Contact us to find your perfect investment.
          </p>
          <Link href="/contact" className="btn-primary" style={{ display: 'inline-block' }}>Consult an Advisor</Link>
        </div>
      </div>
    </div>
  );
}
