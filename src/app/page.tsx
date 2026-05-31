import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";

export default function Home() {
  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className="animate-fade-in gold-gradient-text">
            Invest in Tomorrow,<br/>Own the Future
          </h1>
          <p className="animate-fade-in">
            Premium Agricultural & Investment Land Opportunities in Sindhudurg. Experience luxury real estate consultancy tailored for discerning investors.
          </p>
          <div className={`${styles.heroActions} animate-fade-in`}>
            <Link href="/properties" className="btn-primary">Explore Properties</Link>
            <Link href="/contact" className="btn-outline">Consult an Expert</Link>
          </div>
        </div>
        
        {/* Quick Search Bar */}
        <div className={`${styles.searchWidget} glass-panel animate-fade-in`}>
          <div className={styles.searchInput}>
            <label>Location</label>
            <select>
              <option value="">Select Area</option>
              <option value="dodamarg">Dodamarg</option>
              <option value="sawantwadi">Sawantwadi</option>
            </select>
          </div>
          <div className={styles.searchInput}>
            <label>Property Type</label>
            <select>
              <option value="">Select Type</option>
              <option value="agricultural">Agricultural Land</option>
              <option value="farmhouse">Farmhouse Plot</option>
            </select>
          </div>
          <div className={styles.searchInput}>
            <label>Budget</label>
            <select>
              <option value="">Any Price</option>
              <option value="1cr-5cr">1 Cr - 5 Cr</option>
              <option value="5cr+">5 Cr +</option>
            </select>
          </div>
          <button className="btn-primary">Search</button>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section-container">
        <span className="section-subtitle">Exclusive Listings</span>
        <h2 className="section-title">Featured Properties</h2>
        
        <div className="grid-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className={styles.propertyCard}>
              <div className={styles.propertyImage}>
                <div className={styles.badge}>Premium</div>
              </div>
              <div className={styles.propertyInfo}>
                <h3 className={styles.propertyTitle}>Luxury Farmhouse Estate</h3>
                <p className={styles.propertyLocation}>📍 Dodamarg, Sindhudurg</p>
                <div className={styles.propertyFeatures}>
                  <span>5 Acres</span>
                  <span>Sea View</span>
                  <span>Clear Title</span>
                </div>
                <div className={styles.propertyFooter}>
                  <div className={styles.price}>₹ 2.5 Cr</div>
                  <Link href={`/properties/${item}`} className="btn-outline" style={{padding: '8px 16px', fontSize: '0.8rem'}}>View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4" style={{marginTop: '3rem'}}>
          <Link href="/properties" className="btn-primary">View All Properties</Link>
        </div>
      </section>

      {/* Investment Opportunities */}
      <section className={styles.darkSection}>
        <div className="section-container">
          <div className="grid-2 items-center">
            <div>
              <span className="section-subtitle">Why Sindhudurg?</span>
              <h2 className="section-title" style={{textAlign: 'left'}}>Unprecedented Investment Potential</h2>
              <p className="mb-2 text-secondary">
                With the new Mopa International Airport and rapid infrastructure development, Sindhudurg is poised to become the next major luxury real estate hub. Secure your piece of paradise before valuations skyrocket.
              </p>
              <ul className={styles.featureList}>
                <li>✓ 15 mins from Mopa International Airport</li>
                <li>✓ Next to proposed NH-66 Mumbai-Goa Highway</li>
                <li>✓ High appreciation guaranteed</li>
                <li>✓ 100% Clear title properties</li>
              </ul>
            </div>
            <div className={styles.investmentGrid}>
              <div className={`${styles.investmentCard} glass-panel`}>
                <h4 className="text-gold">300%</h4>
                <p>Expected Appreciation in 5 Years</p>
              </div>
              <div className={`${styles.investmentCard} glass-panel`}>
                <h4 className="text-gold">50+</h4>
                <p>Premium Projects Delivered</p>
              </div>
              <div className={`${styles.investmentCard} glass-panel`}>
                <h4 className="text-gold">100%</h4>
                <p>Legal Transparency</p>
              </div>
              <div className={`${styles.investmentCard} glass-panel`}>
                <h4 className="text-gold">24/7</h4>
                <p>Dedicated Consultant Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="section-container">
        <span className="section-subtitle">Prime Regions</span>
        <h2 className="section-title">Explore Locations</h2>
        <div className="grid-4">
          {['Dodamarg', 'Sawantwadi', 'Vengurla', 'Kudal'].map((loc) => (
            <Link href={`/locations/${loc.toLowerCase()}`} key={loc} className={styles.locationCard}>
              <div className={styles.locationOverlay}>
                <h3>{loc}</h3>
                <p>View Properties →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="section-container text-center">
          <h2>Ready to Build Your Legacy?</h2>
          <p className="text-secondary mb-4" style={{maxWidth: '600px', margin: '0 auto 2rem auto'}}>
            Schedule a private consultation with our luxury property advisors to discover exclusive off-market opportunities.
          </p>
          <Link href="/contact" className="btn-primary">Schedule Consultation</Link>
        </div>
      </section>
    </div>
  );
}
