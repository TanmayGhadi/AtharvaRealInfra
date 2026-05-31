import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.col}>
              <Link href="/" className={styles.logo}>
                <span className={styles.logoGold}>ATHARVA</span> REAL INFRA
              </Link>
              <p className={styles.description}>
                Premium Agricultural & Investment Land Opportunities in Sindhudurg. Experience luxury real estate consultancy tailored for discerning investors.
              </p>
              <div className={styles.socials}>
                <a href="#" aria-label="Instagram">IG</a>
                <a href="#" aria-label="Facebook">FB</a>
                <a href="#" aria-label="LinkedIn">LI</a>
                <a href="#" aria-label="YouTube">YT</a>
              </div>
            </div>
            
            <div className={styles.col}>
              <h4 className={styles.colTitle}>Quick Links</h4>
              <ul className={styles.links}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/properties">Properties</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>

            <div className={styles.col}>
              <h4 className={styles.colTitle}>Locations</h4>
              <ul className={styles.links}>
                <li><Link href="/locations/dodamarg">Dodamarg</Link></li>
                <li><Link href="/locations/sawantwadi">Sawantwadi</Link></li>
                <li><Link href="/locations/vengurla">Vengurla</Link></li>
                <li><Link href="/locations/kudal">Kudal</Link></li>
                <li><Link href="/locations/kankavli">Kankavli</Link></li>
              </ul>
            </div>

            <div className={styles.col}>
              <h4 className={styles.colTitle}>Contact Us</h4>
              <ul className={styles.contactInfo}>
                <li>
                  <span>📍</span> Office Address, Sindhudurg, Maharashtra
                </li>
                <li>
                  <span>📞</span> +91 98765 43210
                </li>
                <li>
                  <span>✉️</span> info@atharvarealinfra.com
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <div className={styles.container}>
          <div className={styles.bottomFlex}>
            <p>&copy; {new Date().getFullYear()} Atharva Real Infra. All Rights Reserved.</p>
            <div className={styles.legalLinks}>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
