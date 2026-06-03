import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { getServiceSupabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function AboutPage() {
  const supabase = getServiceSupabase();
  const { data: settings } = await supabase.from('settings').select('*').single();

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section className="section-container text-center" style={{ paddingBottom: '3rem' }}>
        <span className="section-subtitle reveal">Company Introduction</span>
        <h1 className="section-title reveal stagger-1 gold-gradient-text">Atharva Real Infra</h1>
        <p className="text-secondary reveal stagger-2" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.2rem', lineHeight: '1.8' }}>
          Your premier partner in luxury real estate, agricultural estates, and strategic land investments across Maharashtra, focusing on the rapidly appreciating Sindhudurg region.
        </p>
      </section>

      {/* Company Section */}
      <section style={{ background: 'var(--bg-card)', padding: '5rem 0' }}>
        <div className="section-container grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
          <div className="reveal reveal-left" style={{ position: 'relative', height: '400px', borderRadius: '16px', overflow: 'hidden' }}>
            <Image 
              src="/logo.jpg" 
              alt="Atharva Real Infra Corporate" 
              fill
              style={{ objectFit: 'cover', borderRadius: '50%', border: '4px solid var(--accent-gold)' }} 
            />
          </div>
          <div className="reveal reveal-right">
            <h2 className="text-gold" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Our Story</h2>
            <p className="text-secondary" style={{ lineHeight: '1.8', marginBottom: '1.5rem' }}>
              Founded on the principles of trust, transparency, and foresight, Atharva Real Infra has grown into one of the most respected real estate consultancies in Western India. We specialize in curating high-yield investment properties, from fertile agricultural lands to premium commercial plots.
            </p>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
              <div>
                <h3 className="gold-gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>10+</h3>
                <p className="text-secondary" style={{ fontSize: '0.9rem', textTransform: 'uppercase' }}>Years of Experience</p>
              </div>
              <div>
                <h3 className="gold-gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>500+</h3>
                <p className="text-secondary" style={{ fontSize: '0.9rem', textTransform: 'uppercase' }}>Properties Managed</p>
              </div>
              <div>
                <h3 className="gold-gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>100%</h3>
                <p className="text-secondary" style={{ fontSize: '0.9rem', textTransform: 'uppercase' }}>Legal Transparency</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '6rem 0' }}>
        <div className="section-container grid-2" style={{ gap: '4rem' }}>
          <div className="reveal reveal-left" style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.1)', padding: '3rem', borderRadius: '16px' }}>
            <h2 className="text-gold" style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Our Mission</h2>
            <p className="text-secondary" style={{ lineHeight: '1.8' }}>
              To democratize access to high-yield, premium real estate investments by providing transparent, legally sound, and strategically located land parcels that guarantee exceptional appreciation and secure generational wealth for our clients.
            </p>
          </div>
          <div className="reveal reveal-right" style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.1)', padding: '3rem', borderRadius: '16px' }}>
            <h2 className="text-gold" style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Our Vision</h2>
            <p className="text-secondary" style={{ lineHeight: '1.8' }}>
              To be the most trusted and visionary real estate partner in Western India, renowned for shaping the future of sustainable luxury living and agricultural development while fostering local community growth.
            </p>
          </div>
        </div>
      </section>

      {/* Owner Section */}
      <section style={{ background: 'var(--bg-card)', padding: '6rem 0' }}>
        <div className="section-container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <span className="section-subtitle reveal">Leadership</span>
            <h2 className="section-title reveal stagger-1">Meet The Founder</h2>
          </div>
          <div className="grid-2" style={{ gap: '4rem', alignItems: 'center' }}>
            <div className="reveal reveal-left" style={{ position: 'relative', height: '500px', borderRadius: '16px', overflow: 'hidden' }}>
              <Image 
                src="/owner.jpeg" 
                alt="Founder & Director" 
                fill 
                style={{ objectFit: 'contain', objectPosition: 'center', backgroundColor: 'var(--bg-primary)' }} 
              />
            </div>
            <div className="reveal reveal-right">
              <h3 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Mr. Subhash Vitthal Dalvi</h3>
              <p className="text-gold" style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem' }}>Founder & Director</p>
              <p className="text-secondary" style={{ lineHeight: '1.8', marginBottom: '2rem' }}>
                With over a decade of hands-on experience in the Sindhudurg real estate market, our founder brings unmatched local expertise, a deep understanding of legal frameworks, and a visionary approach to land investment.
              </p>
              <blockquote style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1.5rem', fontStyle: 'italic', color: '#ccc', marginBottom: '2rem' }}>
                "Our commitment is not just to sell land, but to guide our clients towards sustainable wealth creation through strategic, legally vetted, and high-potential property investments."
              </blockquote>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="mailto:ds200784@atharvarealinfra.com" className="btn-primary">Email Directly</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us & Trust */}
      <section className="section-container" style={{ padding: '6rem 0' }}>
        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <span className="section-subtitle reveal">The Atharva Advantage</span>
          <h2 className="section-title reveal stagger-1">Why Choose Us</h2>
        </div>
        
        <div className="grid-3" style={{ gap: '2rem' }}>
          {[
            { title: "Transparent Transactions", desc: "Every deal is documented, verifiable, and completely transparent from day one." },
            { title: "Verified Properties", desc: "Rigorous due diligence ensures 100% clear titles and 7/12 extracts." },
            { title: "Legal Assistance", desc: "End-to-end legal support to ensure hassle-free registration processes." },
            { title: "Investment Guidance", desc: "Data-driven advice to maximize ROI on your real estate portfolio." },
            { title: "Local Market Expertise", desc: "Unmatched knowledge of Sindhudurg's rapidly appreciating corridors." },
            { title: "Customer Support", desc: "Dedicated consultants available 24/7 to assist you post-purchase." },
          ].map((item, i) => (
            <div key={i} className={`reveal stagger-${(i % 3) + 1}`} style={{ padding: '2rem', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
              <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1rem', fontSize: '1.2rem' }}>{item.title}</h3>
              <p className="text-secondary" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Information */}
      <section style={{ background: 'var(--bg-card)', padding: '6rem 0' }}>
        <div className="section-container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <span className="section-subtitle reveal">Get in Touch</span>
            <h2 className="section-title reveal stagger-1">Contact Information</h2>
          </div>
          <div className="grid-3" style={{ gap: '2rem' }}>
            <div className="reveal stagger-1" style={{ padding: '2rem', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>Email & Office</h3>
              <p className="text-secondary" style={{ marginBottom: '0.5rem' }}>✉️ {settings?.email_address || 'ds200784@atharvarealinfra.com'}</p>
              <p className="text-secondary">📍 {settings?.office_address || 'Samartha Residency, Janavali, Kankavli near NH 66'}</p>
            </div>
            
            <div className="reveal stagger-2" style={{ padding: '2rem', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', textAlign: 'center', background: 'rgba(212,175,55,0.05)' }}>
              <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>Call & WhatsApp</h3>
              <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>Reach out to us directly for immediate assistance.</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <a href="tel:+917843097793" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>📞 Call</a>
                <a href="https://wa.me/917843097793" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.5rem 1rem', borderColor: '#25D366', color: '#25D366' }}>WhatsApp</a>
              </div>
            </div>

            <div className="reveal stagger-3" style={{ padding: '2rem', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>Social Media</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {settings?.instagram_url ? <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.5rem 1rem' }}>Instagram</a> : <a href="https://instagram.com/atharvarealinfar" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.5rem 1rem' }}>Instagram</a>}
                  {settings?.facebook_url ? <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.5rem 1rem' }}>Facebook</a> : <a href="https://www.facebook.com/profile.php?id=61590608871679" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.5rem 1rem' }}>Facebook</a>}
                </div>
                {settings?.youtube_url ? <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.5rem 1rem' }}>YouTube</a> : <a href="https://www.youtube.com/@AtharvaRealInfra" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.5rem 1rem' }}>YouTube</a>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & CTA */}
      <section style={{ padding: '6rem 0', background: 'linear-gradient(rgba(10,10,10,0.9), rgba(10,10,10,0.9)), url("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80")', backgroundSize: 'cover', backgroundAttachment: 'fixed', textAlign: 'center' }}>
        <div className="section-container">
          <h2 className="reveal text-gold" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Secure Your Future Today</h2>
          <p className="reveal stagger-1 text-secondary" style={{ maxWidth: '600px', margin: '0 auto 3rem auto', fontSize: '1.1rem' }}>
            From individual buyers looking for a weekend home to institutional investors developing mega-resorts, our portfolio caters to visionaries.
          </p>
          <div className="reveal stagger-2">
            <Link href="/contact" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Consult With Us Today</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
