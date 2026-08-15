import InquiryForm from "@/components/InquiryForm";
import type { Metadata } from "next";
import { getServiceSupabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Contact Us | Atharva Real Infra Land Consultancy",
  description: "Get in touch with Atharva Real Infra. Schedule a private consultation for land investments near Goa, Mopa Airport, and agricultural plots in Sindhudurg.",
  alternates: { canonical: 'https://www.atharvarealinfra.com/contact' }
};

export default async function ContactPage() {
  const supabase = getServiceSupabase();
  const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 1).single();

  return (
    <div style={{ paddingTop: '90px', minHeight: '100vh', backgroundColor: 'var(--warm-ivory, #F5F1E8)', color: 'var(--text-primary, #17231F)' }}>
      
      {/* Page Header */}
      <section style={{ backgroundColor: 'var(--deep-forest, #0C241C)', color: '#F7F4EC', padding: '4.5rem 5% 3.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ color: 'var(--muted-champagne, #C9A24E)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>
            GET IN TOUCH
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', color: '#F7F4EC', marginBottom: '1rem' }}>
            Contact Our Land Advisory Team
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(247, 244, 236, 0.85)', lineHeight: '1.6' }}>
            Reach out for plot inquiries, 7/12 extract verifications, site visits, or tailored land investment consultations.
          </p>
        </div>
      </section>

      <div className="section-container" style={{ paddingBlock: '5rem' }}>
        <div className="grid-2" style={{ gap: '4rem', alignItems: 'flex-start' }}>
          
          {/* Office Details */}
          <div>
            <span className="section-subtitle">Head Office</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>Visit Our Kankavli Office</h2>
            <p className="text-muted" style={{ marginBottom: '2rem', lineHeight: '1.7', whiteSpace: 'pre-line', fontSize: '1.05rem' }}>
              {settings?.office_address || 'Samartha Residency, Janavali\nKankavli near NH 66, Sindhudurg, Maharashtra'}
            </p>

            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-forest)', fontSize: '1.35rem', marginBottom: '1rem' }}>
              Direct Channels
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📞</span>
                <a href={`tel:${settings?.phone_number || '+918788818163'}`} style={{ color: 'var(--primary-forest)', fontWeight: 600, textDecoration: 'none' }}>
                  {settings?.phone_number || '+91 87888 18163'}
                </a>
              </li>
              
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                <span style={{ color: '#25D366', display: 'inline-flex', alignItems: 'center' }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.18-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.098 8.098 0 0 1-1.24-4.38c0-4.47 3.64-8.11 8.11-8.11 2.16 0 4.2.84 5.73 2.37 1.53 1.53 2.37 3.57 2.37 5.73-.01 4.47-3.65 8.12-8.11 8.12zm4.44-6.07c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-1.54-.77-2.63-1.4-3.67-3.2-.27-.47.27-.44.78-1.46.08-.16.04-.3-.02-.42s-.54-1.3-.74-1.78c-.2-.48-.4-.41-.54-.42-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z"/>
                  </svg>
                </span>
                <a 
                  href={`https://wa.me/${settings?.whatsapp_number || '918788818163'}?text=Hello%20Atharva%20Real%20Infra,%20I%20have%20an%20inquiry.`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: '#25D366', fontWeight: 700, textDecoration: 'none' }}
                >
                  Direct WhatsApp Chat
                </a>
              </li>

              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                <span style={{ fontSize: '1.2rem' }}>✉️</span>
                <a href={`mailto:${settings?.email_address || 'ds200784@atharvarealinfra.com'}`} style={{ color: 'var(--primary-forest)', fontWeight: 600, textDecoration: 'none' }}>
                  {settings?.email_address || 'ds200784@atharvarealinfra.com'}
                </a>
              </li>
            </ul>

            <div style={{ marginTop: '2.5rem', padding: '2rem', backgroundColor: 'var(--soft-cream, #EDE7DA)', border: '1px solid rgba(18, 49, 40, 0.12)', borderRadius: '8px' }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-forest)', marginBottom: '0.5rem', fontSize: '1.15rem' }}>
                Consultation Hours
              </h4>
              <p className="text-muted" style={{ fontSize: '0.92rem', marginBottom: '0.35rem' }}>Monday – Saturday: 9:00 AM to 7:00 PM</p>
              <p className="text-muted" style={{ fontSize: '0.92rem' }}>Sunday: Available by prior appointment</p>
            </div>
          </div>

          {/* Contact Form Block */}
          <div style={{ backgroundColor: 'var(--soft-cream, #EDE7DA)', padding: '2.5rem', borderRadius: '10px', border: '1px solid rgba(18, 49, 40, 0.12)', boxShadow: '0 4px 15px rgba(18, 49, 40, 0.05)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-forest)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
              Send an Inquiry
            </h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.75rem' }}>
              Fill in your details below and a land advisor will reach out promptly.
            </p>
            <InquiryForm propertyId="" />
          </div>

        </div>
      </div>
    </div>
  );
}
