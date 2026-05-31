import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";

export default function PropertyDetails({ params }: { params: { id: string } }) {
  // In a real app, fetch data based on params.id
  
  return (
    <div className={styles.propertyDetailsPage}>
      {/* Gallery Section */}
      <section className={styles.gallerySection}>
        <div className={styles.mainImage}>
          {/* Main property image */}
        </div>
        <div className={styles.thumbnailGrid}>
          <div className={styles.thumbnail}></div>
          <div className={styles.thumbnail}></div>
          <div className={styles.thumbnail}></div>
          <div className={styles.thumbnail}>
            <div className={styles.moreOverlay}>+12 Photos</div>
          </div>
        </div>
      </section>

      <div className="section-container">
        <div className={styles.layout}>
          {/* Main Content */}
          <div className={styles.content}>
            <div className={styles.header}>
              <div className={styles.badge}>Premium Farmhouse</div>
              <h1>Luxury Farmhouse Estate</h1>
              <p className={styles.location}>📍 Dodamarg, Sindhudurg, Maharashtra</p>
              
              <div className={styles.keyStats}>
                <div className={styles.statBox}>
                  <span>Price</span>
                  <h4>₹ 2.5 Cr</h4>
                </div>
                <div className={styles.statBox}>
                  <span>Area</span>
                  <h4>5 Acres</h4>
                </div>
                <div className={styles.statBox}>
                  <span>Status</span>
                  <h4 className="text-gold">Available</h4>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2>Property Overview</h2>
              <p>
                Experience the epitome of luxury living amidst nature. This spectacular 5-acre estate offers breathtaking panoramic views of the Sahyadri mountains. Perfectly suited for a grand farmhouse or an eco-resort development. The land features rich red soil, abundant water supply, and hundreds of mature cashew and mango trees.
              </p>
              <p>
                Located just 20 minutes from the new Mopa International Airport, this property promises not just a luxurious retreat, but a highly lucrative investment opportunity with excellent appreciation potential.
              </p>
            </div>

            <div className={styles.section}>
              <h2>Investment Highlights</h2>
              <ul className={styles.featuresList}>
                <li>Clear marketable title with 7/12 extract</li>
                <li>Demarcated boundaries with fencing</li>
                <li>24/7 water availability (Borewell & River proximity)</li>
                <li>Electricity connection readily available</li>
                <li>Tar road access till the property</li>
                <li>High ROI expected due to Mopa Airport proximity</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>Location Map</h2>
              <div className={styles.mapContainer}>
                {/* Embed Google Map here */}
                <div className={styles.mapPlaceholder}>Interactive Map View</div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.contactCard}>
              <h3>Interested in this property?</h3>
              <p>Contact our luxury real estate experts for a private viewing or more details.</p>
              
              <div className={styles.actions}>
                <a href="tel:+919876543210" className="btn-primary" style={{display: 'block', textAlign: 'center'}}>Call Now</a>
                <a href="https://wa.me/919876543210" className="btn-outline" style={{display: 'block', textAlign: 'center'}}>WhatsApp</a>
                <button className="btn-outline" style={{width: '100%'}}>Download Brochure</button>
              </div>

              <div className={styles.divider}>or</div>

              <form className={styles.inquiryForm}>
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Email Address" required />
                <input type="tel" placeholder="Phone Number" required />
                <textarea placeholder="I am interested in this property..." rows={4}></textarea>
                <button type="submit" className="btn-primary" style={{width: '100%'}}>Submit Inquiry</button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
