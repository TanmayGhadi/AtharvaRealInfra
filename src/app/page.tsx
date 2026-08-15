import Link from "next/link";
import styles from "./page.module.css";
import { getServiceSupabase } from "@/lib/supabase";
import PropertyCard from "@/components/PropertyCard";
import HomeFilter from "@/components/HomeFilter";
import HeroVideo from "@/components/HeroVideo";
import LocationsSection from "@/components/LocationsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Agricultural Land Investment | Atharva Real Infra",
  description: "Invest in premium agricultural land and NA plots in Sindhudurg, Konkan, near Mopa Airport and Goa. Trusted land investment opportunities.",
  alternates: { canonical: 'https://www.atharvarealinfra.com' }
};

export const revalidate = 60;

export default async function Home() {
  const supabase = getServiceSupabase();
  let { data: featuredProperties, error } = await supabase
    .from('properties')
    .select('*')
    .eq('is_featured', true)
    .limit(3);
    
  if (error) console.error("Error fetching featured properties:", error);

  if (!featuredProperties || featuredProperties.length === 0) {
    const { data: latest } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    featuredProperties = latest || [];
  }

  return (
    <div className={styles.home}>
      {/* Hero Section with Drone Video Background */}
      <section className={styles.hero}>
        <HeroVideo className={styles.heroVideo} />
        
        <div className={styles.heroOverlay}></div>

        <div className={styles.heroContent}>
          <h1 className="animate-fade-in">
            Invest in Land.<br />
            Secure Your <span className={styles.heroHeadlineAccent}>Future.</span>
          </h1>
          <p className="animate-fade-in-1">
            Premium agricultural land and NA plots across Sindhudurg and Konkan, strategically positioned near Goa and Mopa Airport.
          </p>
          <div className={`${styles.heroActions} animate-fade-in-2`}>
            <Link href="/properties" className={styles.heroCtaPrimary}>
              EXPLORE PROPERTIES
            </Link>
            <Link href="/contact" className={styles.heroCtaSecondary}>
              CONSULT AN EXPERT
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`${styles.scrollIndicator} animate-fade-in-3`}>
          <div className={styles.scrollLine}></div>
          <span>SCROLL TO EXPLORE</span>
        </div>
      </section>

      {/* Hero Search Panel Container */}
      <section className="section-container" style={{ paddingTop: '3.5rem', paddingBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
        <HomeFilter />
      </section>

      {/* Featured Properties Section */}
      <section className="section-container" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
        <span className="section-subtitle reveal">Handpicked Opportunities</span>
        <h2 className="section-title reveal stagger-1">Featured Land Opportunities</h2>
        <p className="text-muted reveal stagger-2" style={{ marginBottom: '2.5rem', maxWidth: '600px' }}>
          Explore verified agricultural, commercial, and NA plots offering high long-term appreciation in prime Konkan corridors.
        </p>

        <div className="grid-3">
          {featuredProperties && featuredProperties.length > 0 ? (
            featuredProperties.map((prop: any, idx: number) => (
              <PropertyCard key={prop.id} prop={prop} index={idx} />
            ))
          ) : (
            <p className="text-muted" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              No featured properties available at the moment.
            </p>
          )}
        </div>
        
        <div className="text-center" style={{ marginTop: '3.5rem' }}>
          <Link href="/properties" className="btn-primary reveal">View All Properties</Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section className={styles.statsBar}>
        {[
          { value: '300%', label: 'Expected 5-Yr Appreciation' },
          { value: '50+',  label: 'Successful Land Deals' },
          { value: '100%', label: 'Legal & Title Guarantee' },
          { value: '24/7', label: 'Local Advisory Support' },
        ].map((stat, i) => (
          <div key={stat.label} className={`${styles.statItem} reveal stagger-${i + 1}`}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Per Acre Value Insights */}
      <section className="section-container" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div style={{ 
          backgroundColor: 'var(--soft-cream, #EDE7DA)', 
          borderRadius: '12px', 
          padding: '3.5rem 2.5rem', 
          border: '1px solid rgba(18, 49, 40, 0.12)' 
        }} className="reveal">
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
            <span className="section-subtitle">Smart Land Investment</span>
            <h2 className="section-title">Transparent Per-Acre Pricing</h2>
            <p className="text-muted" style={{ marginBottom: '2.5rem', lineHeight: '1.7' }}>
              We believe in complete financial clarity. Our listings provide normalized <strong style={{ color: 'var(--primary-forest)' }}>price per acre calculations</strong> so you can compare genuine value across different talukas without guesswork.
            </p>
            <div className="grid-3" style={{ textAlign: 'left' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '8px', border: '1px solid rgba(18, 49, 40, 0.08)' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>🧮</div>
                <h4 style={{ color: 'var(--primary-forest)', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Automated Math</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>Instantly view accurate per-acre rates alongside total package prices.</p>
              </div>
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '8px', border: '1px solid rgba(18, 49, 40, 0.08)' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>⚖️</div>
                <h4 style={{ color: 'var(--primary-forest)', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Direct Comparison</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>Compare small NA plots against multi-acre agricultural land transparently.</p>
              </div>
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '8px', border: '1px solid rgba(18, 49, 40, 0.08)' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>💡</div>
                <h4 style={{ color: 'var(--primary-forest)', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Value Discovery</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>Identify high-growth corridors before market prices adjust.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Potential Section */}
      <section className={styles.darkSection}>
        <div className="section-container">
          <div className="grid-2 items-center">
            <div className="reveal">
              <span className="section-subtitle">Regional Potential</span>
              <h2 className="section-title" style={{ textAlign: 'left', color: '#F7F4EC' }}>
                Why Invest in<br/>Sindhudurg & Konkan?
              </h2>
              <p className="text-muted" style={{ color: 'rgba(247, 244, 236, 0.8)', marginBottom: '1.5rem', lineHeight: '1.7' }}>
                With Mopa International Airport operational and ongoing expansion of the NH-66 highway corridor, Sindhudurg is witnessing unprecedented demand for agricultural estates, farmhouses, and commercial plots.
              </p>
              <ul className={styles.featureList}>
                {[
                  'Strategic proximity to Mopa Airport & North Goa border',
                  'Excellent connectivity via NH-66 Mumbai-Goa Highway',
                  '100% verified legal titles and documentation',
                  'End-to-end assistance from local land specialists',
                ].map((item, i) => (
                  <li key={i} className={`reveal stagger-${i + 1}`}>
                    <span className={styles.checkIcon}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className={styles.investmentGrid}>
              {[
                { value: '300%', label: '5-Yr Appreciation Forecast' },
                { value: '50+',  label: 'Verified Projects' },
                { value: '100%', label: 'Legal Due Diligence' },
                { value: '24/7', label: 'Client Support' },
              ].map((card, i) => (
                <div key={i} className={styles.investmentCard}>
                  <h4>{card.value}</h4>
                  <p>{card.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prime Locations Grid */}
      <section className="section-container" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <span className="section-subtitle reveal">Prime Micro-Markets</span>
        <h2 className="section-title reveal stagger-1">Explore Featured Regions</h2>
        <div className="grid-4">
          {[
            { name: 'Kankavli',   img: '/loc1.png' },
            { name: 'Dodamarg',   img: '/loc2.png' },
            { name: 'Sawantwadi', img: '/sawantwadi.png' },
            { name: 'Devgad',     img: '/devgad.png' },
          ].map((loc, i) => (
            <Link
              href={`/properties?taluka=${loc.name}`}
              key={loc.name}
              className={`${styles.locationCard} reveal stagger-${i + 1}`}
              style={{ backgroundImage: `url(${loc.img})` }}
              role="img"
              aria-label={`Real estate and land investment opportunities in ${loc.name}`}
            >
              <div className={styles.locationOverlay}>
                <h3>{loc.name}</h3>
                <p>View Properties →</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Location Chips */}
        <LocationsSection />
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="section-container text-center">
          <h2 className="reveal">Let's Discuss Your Land Investment</h2>
          <p className="text-muted reveal stagger-1" style={{ color: 'rgba(247, 244, 236, 0.8)', maxWidth: '600px', margin: '0 auto 2.25rem auto', lineHeight: '1.6' }}>
            Schedule a private consultation with our regional land advisory team to explore curated opportunities.
          </p>
          <Link href="/contact" className="btn-accent reveal stagger-2">
            Schedule Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
