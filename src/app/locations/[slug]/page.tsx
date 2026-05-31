import Link from "next/link";
import homeStyles from "../../page.module.css";
import styles from "./location.module.css";

export default function LocationPage({ params }: { params: { slug: string } }) {
  const locationName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  
  return (
    <div className={styles.locationPage}>
      <div className={styles.locationHero}>
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
          {[1, 2, 3].map((item) => (
            <div key={item} className={homeStyles.propertyCard}>
              <div className={homeStyles.propertyImage}>
                <div className={homeStyles.badge}>Exclusive</div>
              </div>
              <div className={homeStyles.propertyInfo}>
                <h3 className={homeStyles.propertyTitle}>Premium Plot {item}</h3>
                <p className={homeStyles.propertyLocation}>📍 {locationName}, Sindhudurg</p>
                <div className={homeStyles.propertyFeatures}>
                  <span>{item * 2} Acres</span>
                  <span>Clear Title</span>
                </div>
                <div className={homeStyles.propertyFooter}>
                  <div className={homeStyles.price}>₹ {item + 1}.5 Cr</div>
                  <Link href={`/properties/${item}`} className="btn-outline" style={{padding: '8px 16px', fontSize: '0.8rem'}}>View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
