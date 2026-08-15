import Link from "next/link";
import Image from "next/image";
import styles from "./about.module.css";
import { getServiceSupabase } from "@/lib/supabase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Atharva Real Infra Land Consultancy",
  description: "Established real estate and agricultural land consultancy in Sindhudurg. Trusted advisory with local market knowledge and legal title transparency.",
  alternates: { canonical: 'https://www.atharvarealinfra.com/about' }
};

export const revalidate = 60;

export default async function AboutPage() {
  const supabase = getServiceSupabase();
  const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 1).single();

  return (
    <div className={styles.aboutPage}>
      
      {/* Header Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <span className={styles.heroSubtitle}>
            ABOUT ATHARVA REAL INFRA
          </span>
          <h1 className={styles.heroTitle}>
            Local Knowledge.<br/>Long-Term Perspective.
          </h1>
          <p className={styles.heroDescription}>
            Dedicated land investment consultancy specializing in agricultural estates, farmhouses, and commercial parcels across Sindhudurg and Konkan.
          </p>
        </div>
      </section>

      {/* Established Overview Section */}
      <section className="section-container" style={{ paddingBlock: '5rem' }}>
        <div className="grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
          <div style={{ position: 'relative', height: '380px', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'var(--primary-forest, #123128)', border: '1px solid rgba(18, 49, 40, 0.15)' }}>
            <Image 
              src="/logo.jpg" 
              alt="Atharva Real Infra Corporate Logo" 
              fill
              style={{ objectFit: 'cover', opacity: 0.95 }} 
            />
          </div>
          <div>
            <span className="section-subtitle">Our Foundation</span>
            <h2 className="section-title" style={{ textAlign: 'left' }}>Ground-Level Expertise in Konkan Real Estate</h2>
            <p className="text-muted" style={{ fontSize: '1.02rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>
              Atharva Real Infra was established to provide transparent, legally sound guidance for land buyers navigating the Sindhudurg market. We focus on high-potential land corridors created by major regional developments, including the Mopa International Airport and the NH-66 highway expansion.
            </p>
            <p className="text-muted" style={{ fontSize: '1.02rem', lineHeight: '1.7' }}>
              We manage the entire lifecycle of land acquisition — from initial 7/12 extract due diligence and boundary demarcation to legal transfers and registration.
            </p>
          </div>
        </div>
      </section>

      {/* Strategic Information Blocks */}
      <section style={{ backgroundColor: 'var(--soft-cream, #EDE7DA)', padding: '5rem 0', borderBlock: '1px solid rgba(18, 49, 40, 0.1)' }}>
        <div className="section-container">
          <div className="text-center" style={{ marginBottom: '3.5rem' }}>
            <span className="section-subtitle">Core Capabilities</span>
            <h2 className="section-title">Why Atharva Real Infra</h2>
          </div>

          <div className="grid-2" style={{ gap: '2rem' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '2.25rem', borderRadius: '8px', border: '1px solid rgba(18, 49, 40, 0.08)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-forest)', fontSize: '1.3rem', marginBottom: '0.75rem' }}>
                Local Market Knowledge
              </h3>
              <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.65' }}>
                Deep, first-hand understanding of talukas including Kankavli, Dodamarg, Sawantwadi, Kudal, and Vengurla. We know local land values, zone classifications, and growth factors.
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '2.25rem', borderRadius: '8px', border: '1px solid rgba(18, 49, 40, 0.08)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-forest)', fontSize: '1.3rem', marginBottom: '0.75rem' }}>
                Carefully Selected Properties
              </h3>
              <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.65' }}>
                Every plot in our portfolio undergoes thorough screening for clear title ownership, road accessibility, water sources, and realistic market valuation before listing.
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '2.25rem', borderRadius: '8px', border: '1px solid rgba(18, 49, 40, 0.08)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-forest)', fontSize: '1.3rem', marginBottom: '0.75rem' }}>
                Transparent Guidance
              </h3>
              <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.65' }}>
                Clear breakdown of package costs, normalized per-acre pricing, and legal documentation. No hidden fees or ambiguous property boundaries.
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '2.25rem', borderRadius: '8px', border: '1px solid rgba(18, 49, 40, 0.08)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-forest)', fontSize: '1.3rem', marginBottom: '0.75rem' }}>
                Investment-Focused Approach
              </h3>
              <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.65' }}>
                Whether you are seeking agricultural land for farmhouses or commercial land near transit corridors, we align recommendations with your long-term financial goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Owner Section */}
      <section className={styles.ownerSection}>
        <div className="section-container">
          <span className={styles.mobileEyebrow}>OWNER</span>

          <div className={styles.ownerGrid}>
            <div className={styles.portraitColumn}>
              <div className={styles.portraitWrapper}>
                <Image 
                  src="/owner.jpeg" 
                  alt="Mr. Subhash Vitthal Dalvi - Owner" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 520px"
                  className={styles.portraitImage} 
                  priority
                />
              </div>
            </div>

            <div className={styles.contentColumn}>
              <span className={styles.desktopEyebrow}>OWNER</span>
              <h2 className={styles.ownerName}>Mr. Subhash Vitthal Dalvi</h2>
              <p className={styles.ownerDesignation}>
                FOUNDER & MANAGING PRINCIPAL
              </p>
              <p className={styles.ownerDescription}>
                Bringing over a decade of dedicated field experience in regional land consulting, Mr. Dalvi has built Atharva Real Infra on principles of integrity, client-first advisory, and rigorous due diligence.
              </p>
              <blockquote className={styles.ownerQuote}>
                “Land is a generational asset. Our mandate is to protect our clients' capital by offering legally verified, strategically positioned real estate across Konkan.”
              </blockquote>
              <a href={`mailto:${settings?.email_address || 'ds200784@atharvarealinfra.com'}`} className={styles.ownerCtaBtn}>
                CONTACT OWNER
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ backgroundColor: 'var(--deep-forest, #0C241C)', color: '#F7F4EC', padding: '5rem 5%', textAlign: 'center' }}>
        <div className="section-container">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', marginBottom: '1rem', color: '#F7F4EC' }}>
            Looking for Land Opportunities?
          </h2>
          <p style={{ color: 'rgba(247, 244, 236, 0.8)', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
            Speak with our team today to review current property listings or discuss custom land requirements.
          </p>
          <Link href="/contact" className="btn-accent">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
