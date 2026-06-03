import Link from "next/link";
import styles from "./page.module.css";
import { getServiceSupabase } from "@/lib/supabase";
import PropertyCard from "@/components/PropertyCard";
import HomeFilter from "@/components/HomeFilter"; // We will create this

export const revalidate = 60;

export default async function Home() {
  const supabase = getServiceSupabase();
  let { data: featuredProperties, error } = await supabase
    .from('properties')
    .select('*')
    .eq('is_featured', true)
    .limit(3);
    
  if (error) console.error("Error fetching featured properties:", error);

  // Fallback if no featured properties
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
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className="animate-fade-in gold-gradient-text">
            Invest in Land.<br/>Secure Your Future.
          </h1>
          <p className="animate-fade-in-1">
            Premium Agricultural Lands Across Sindhudurg. Experience luxury real estate consultancy tailored for discerning investors.
          </p>
          <div className={`${styles.heroActions} animate-fade-in-2`}>
            <Link href="/properties" className={`btn-primary ${styles.heroCta}`}>Explore Properties</Link>
            <Link href="/contact" className="btn-outline">Consult an Expert</Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`${styles.scrollIndicator} animate-fade-in-3`}>
          <div className={styles.scrollLine}></div>
          <span>Scroll to Explore</span>
        </div>
      </section>

      {/* Quick Search Bar */}
      <section className="section-container" style={{ paddingTop: '4rem', paddingBottom: '0', display: 'flex', justifyContent: 'center' }}>
        <HomeFilter />
      </section>

      {/* Featured Properties */}
      <section className="section-container" style={{ paddingTop: '4rem' }}>
        <span className="section-subtitle reveal">Exclusive Listings</span>
        <h2 className="section-title reveal stagger-1">Featured Properties</h2>

        <div className="grid-3">
          {featuredProperties && featuredProperties.length > 0 ? (
            featuredProperties.map((prop: any, idx: number) => (
              <PropertyCard key={prop.id} prop={prop} index={idx} />
            ))
          ) : (
            <p className="text-secondary" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
              No properties available yet — check back soon.
            </p>
          )}
        </div>
        <div className="text-center" style={{marginTop: '3rem'}}>
          <Link href="/properties" className="btn-primary reveal">View All Properties</Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section className={styles.statsBar}>
        {[
          { value: '300%', label: 'Expected Appreciation' },
          { value: '50+',  label: 'Projects Delivered' },
          { value: '100%', label: 'Legal Transparency' },
          { value: '24/7', label: 'Consultant Support' },
        ].map((stat, i) => (
          <div key={stat.label} className={`${styles.statItem} reveal stagger-${i + 1}`}>
            <div className={`${styles.statValue} gold-gradient-text`}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Per Acre Insights */}
      <section className="section-container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(10, 10, 10, 0.8) 100%)', borderRadius: '16px', padding: '3rem', border: '1px solid rgba(212, 175, 55, 0.2)' }} className="reveal">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <span className="section-subtitle">Smart Investment</span>
            <h2 className="section-title">Transparent Per-Acre Pricing</h2>
            <p className="text-secondary" style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
              We believe in complete transparency. Our platform automatically calculates and displays the exact <strong style={{ color: 'var(--accent-gold)'}}>price per acre</strong> for all agricultural and investment properties. Compare true value across different regions of Sindhudurg without the guesswork.
            </p>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', flex: '1', minWidth: '200px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧮</div>
                <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>Auto-Calculated</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Instantly see the per-acre value on every property listing.</p>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', flex: '1', minWidth: '200px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚖️</div>
                <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>Easy Comparison</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Compare 5-acre farms vs 20-acre estates on an even playing field.</p>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', flex: '1', minWidth: '200px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💡</div>
                <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>Value Insights</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Spot undervalued opportunities faster with normalized pricing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Opportunities */}
      <section className={styles.darkSection}>
        <div className="section-container">
          <div className="grid-2 items-center">
            <div className="reveal reveal-left">
              <span className="section-subtitle">Why Sindhudurg?</span>
              <h2 className="section-title" style={{textAlign: 'left'}}>Unprecedented<br/>Investment Potential</h2>
              <p className="mb-2 text-secondary">
                With the new Mopa International Airport and rapid infrastructure development, Sindhudurg is poised to become the next major luxury real estate hub. Secure your piece of paradise before valuations skyrocket.
              </p>
              <ul className={styles.featureList}>
                {[
                  '15 mins from Mopa International Airport',
                  'Next to proposed NH-66 Mumbai-Goa Highway',
                  'High appreciation guaranteed',
                  '100% Clear title properties',
                ].map((item, i) => (
                  <li key={i} className={`reveal stagger-${i + 1}`}>
                    <span className={styles.checkIcon}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${styles.investmentGrid} reveal reveal-right`}>
              {[
                { value: '300%', label: 'Expected Appreciation in 5 Years' },
                { value: '50+',  label: 'Premium Projects Delivered' },
                { value: '100%', label: 'Legal Transparency' },
                { value: '24/7', label: 'Dedicated Consultant Support' },
              ].map((card, i) => (
                <div key={i} className={`${styles.investmentCard} glass-panel stagger-${i + 1}`}>
                  <h4 className="text-gold">{card.value}</h4>
                  <p>{card.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="section-container">
        <span className="section-subtitle reveal">Prime Regions</span>
        <h2 className="section-title reveal stagger-1">Explore Locations</h2>
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
            >
              <div className={styles.locationOverlay}>
                <h3>{loc.name}</h3>
                <p>View Properties →</p>
              </div>
            </Link>
          ))}
        </div>

        {/* More Locations */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <h3 className="reveal" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>More Locations We Serve</h3>
          <div className="reveal stagger-2" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {['Rajapur', 'Mandangad', 'Shrivardhan', 'Mangaon', 'Roha', 'Kudal', 'Vengurla'].map((loc) => (
              <Link 
                key={loc} 
                href={`/properties?taluka=${loc}`}
                className={styles.locationChip}
              >
                {loc}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Marquee */}
      <section className={styles.testimonialStrip}>
        <div className={styles.testimonialTrack}>
          {[
            '"Best investment decision of my life. The land I bought doubled in value within 2 years." — Rajesh M., Pune',
            '"Atharva Real Infra handled everything seamlessly. Transparent, professional, and trustworthy." — Priya S., Mumbai',
            '"Got a beautiful farmhouse plot in Dodamarg. The team was with us every step of the way." — Amit K., Kolhapur',
            '"Best investment decision of my life. The land I bought doubled in value within 2 years." — Rajesh M., Pune',
            '"Atharva Real Infra handled everything seamlessly. Transparent, professional, and trustworthy." — Priya S., Mumbai',
          ].map((t, i) => (
            <div key={i} className={styles.testimonialItem}>
              <span className={styles.quoteIcon}>"</span>
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="section-container text-center">
          <h2 className="reveal">Ready to Build Your Legacy?</h2>
          <p className="text-secondary reveal stagger-1" style={{maxWidth: '600px', margin: '0 auto 2rem auto'}}>
            Schedule a private consultation with our luxury property advisors to discover exclusive off-market opportunities.
          </p>
          <Link href="/contact" className={`btn-primary ${styles.heroCta} reveal stagger-2`}>Schedule Consultation</Link>
        </div>
      </section>
    </div>
  );
}
