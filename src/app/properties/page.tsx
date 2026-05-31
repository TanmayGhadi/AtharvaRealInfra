import Link from "next/link";
import styles from "./page.module.css";
import homeStyles from "../page.module.css"; // Reuse some styles

export default function Properties() {
  const properties = [
    { id: 1, title: "Luxury Farmhouse Estate", location: "Dodamarg", area: "5 Acres", price: "₹ 2.5 Cr", type: "Farmhouse" },
    { id: 2, title: "Premium Agricultural Land", location: "Sawantwadi", area: "10 Acres", price: "₹ 1.8 Cr", type: "Agricultural" },
    { id: 3, title: "Hilltop Sea View Plot", location: "Vengurla", area: "2 Acres", price: "₹ 3.2 Cr", type: "Investment" },
    { id: 4, title: "Riverside Development Land", location: "Kudal", area: "8 Acres", price: "₹ 4.5 Cr", type: "Development" },
    { id: 5, title: "Mango Orchard", location: "Kankavli", area: "15 Acres", price: "₹ 5.0 Cr", type: "Agricultural" },
    { id: 6, title: "Highway Touch Plot", location: "Dodamarg", area: "1 Acre", price: "₹ 1.2 Cr", type: "Commercial" },
  ];

  return (
    <div className={styles.propertiesPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1>Exclusive Properties</h1>
          <p>Discover our curated portfolio of premium land opportunities.</p>
        </div>
      </div>

      <div className={`section-container ${styles.layout}`}>
        {/* Sidebar Filters */}
        <aside className={styles.sidebar}>
          <div className={styles.filterGroup}>
            <h4>Location</h4>
            <label><input type="checkbox" /> Dodamarg</label>
            <label><input type="checkbox" /> Sawantwadi</label>
            <label><input type="checkbox" /> Vengurla</label>
            <label><input type="checkbox" /> Kudal</label>
            <label><input type="checkbox" /> Kankavli</label>
          </div>
          
          <div className={styles.filterGroup}>
            <h4>Property Type</h4>
            <label><input type="checkbox" /> Agricultural Land</label>
            <label><input type="checkbox" /> Farmhouse Plot</label>
            <label><input type="checkbox" /> Commercial Land</label>
            <label><input type="checkbox" /> Investment Plot</label>
          </div>

          <div className={styles.filterGroup}>
            <h4>Budget</h4>
            <label><input type="radio" name="budget" /> Any</label>
            <label><input type="radio" name="budget" /> Under ₹1 Cr</label>
            <label><input type="radio" name="budget" /> ₹1 Cr - ₹3 Cr</label>
            <label><input type="radio" name="budget" /> ₹3 Cr - ₹5 Cr</label>
            <label><input type="radio" name="budget" /> ₹5 Cr +</label>
          </div>
          
          <button className="btn-primary" style={{width: '100%', marginTop: '1rem'}}>Apply Filters</button>
        </aside>

        {/* Property Grid */}
        <div className={styles.mainContent}>
          <div className={styles.toolbar}>
            <p>Showing {properties.length} properties</p>
            <select className={styles.sortSelect}>
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>

          <div className="grid-2">
            {properties.map((prop) => (
              <div key={prop.id} className={homeStyles.propertyCard}>
                <div className={homeStyles.propertyImage}>
                  <div className={homeStyles.badge}>{prop.type}</div>
                </div>
                <div className={homeStyles.propertyInfo}>
                  <h3 className={homeStyles.propertyTitle}>{prop.title}</h3>
                  <p className={homeStyles.propertyLocation}>📍 {prop.location}, Sindhudurg</p>
                  <div className={homeStyles.propertyFeatures}>
                    <span>{prop.area}</span>
                    <span>Clear Title</span>
                  </div>
                  <div className={homeStyles.propertyFooter}>
                    <div className={homeStyles.price}>{prop.price}</div>
                    <Link href={`/properties/${prop.id}`} className="btn-outline" style={{padding: '8px 16px', fontSize: '0.8rem'}}>View Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
