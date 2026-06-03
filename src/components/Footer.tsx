import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";
import { supabase } from "@/lib/supabase";

export default async function Footer() {
  const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 1).single();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.col}>
              <Link href="/" className={styles.logo}>
                <Image src="/logo.jpg" alt="Atharva Real Infra Logo" width={60} height={60} className={styles.logoImage} />
                <span style={{ marginLeft: '10px' }}><span className={styles.logoGold}>ATHARVA</span> REAL INFRA</span>
              </Link>
              <p className={styles.description}>
                Premium Agricultural & Investment Land Opportunities in Sindhudurg. Experience luxury real estate consultancy tailored for discerning investors.
              </p>
              <div className={styles.socials}>
                {settings?.instagram_url ? <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a> : <a href="https://instagram.com/atharvarealinfar" target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>}
                {settings?.facebook_url ? <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook">FB</a> : <a href="https://www.facebook.com/profile.php?id=61590608871679" target="_blank" rel="noopener noreferrer" aria-label="Facebook">FB</a>}
                {settings?.linkedin_url && <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">LI</a>}
                {settings?.youtube_url ? <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" aria-label="YouTube">YT</a> : <a href="https://www.youtube.com/@AtharvaRealInfra" target="_blank" rel="noopener noreferrer" aria-label="YouTube">YT</a>}
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
                <li><Link href="/locations/malvan">Malvan</Link></li>
                <li><Link href="/locations/vaibhavwadi">Vaibhavwadi</Link></li>
              </ul>
            </div>

            <div className={styles.col}>
              <h4 className={styles.colTitle}>Contact Us</h4>
              <ul className={styles.contactInfo}>
                <li>
                  <span>📍</span> {settings?.office_address || 'Samartha Residency, Janavali, Kankavli near NH 66'}
                </li>
                <li>
                  <span>📞</span> {settings?.phone_number || '+91 7843097793'}
                </li>
                <li>
                  <span>✉️</span> {settings?.email_address || 'ds200784@atharvarealinfra.com'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <div className={styles.container}>
          <div className={styles.bottomFlex}>
            <p>&copy; {new Date().getFullYear()} {settings?.company_name || 'Atharva Real Infra'}. All Rights Reserved.</p>
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
