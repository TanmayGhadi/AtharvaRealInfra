import InquiryForm from "@/components/InquiryForm";
import styles from "../properties/[id]/page.module.css"; // Reuse styling
import homeStyles from "../page.module.css";
import type { Metadata } from "next";
import { getServiceSupabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Atharva Real Infra. Schedule a consultation for land investment near Goa, Mopa Airport, and agricultural plots in Sindhudurg.",
};

export default async function ContactPage() {
  const supabase = getServiceSupabase();
  const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 1).single();

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .contact-link {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s;
        }
        .contact-link:hover {
          color: var(--accent-gold, #D4AF37) !important;
        }
        .whatsapp-contact-link {
          color: #25D366;
          text-decoration: none;
          font-weight: bold;
          display: inline-flex;
          align-items: center;
          transition: transform 0.2s;
        }
        .whatsapp-contact-link:hover {
          transform: scale(1.03);
        }
      `}} />
      
      <div className="section-container">
        <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
          <span className="section-subtitle">Get In Touch</span>
          <h1 className="section-title">Contact Our Advisors</h1>
          <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Schedule a private consultation with our luxury property advisors to discover exclusive off-market opportunities in Sindhudurg.
          </p>
        </div>

        <div className="grid-2" style={{ gap: '4rem', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>Head Office</h2>
            <p className="text-secondary" style={{ marginBottom: '2rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
              {settings?.office_address || 'Samartha Residency, Janavali\nKankavli near NH 66'}
            </p>

            <h3 style={{ marginBottom: '1rem' }}>Direct Contact</h3>
            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)' }}>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📞</span>
                <a href={`tel:${settings?.phone_number || '+917843097793'}`} className="contact-link">
                  {settings?.phone_number || '+91 7843097793'}
                </a>
              </li>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#25D366', display: 'inline-flex', alignItems: 'center' }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.18-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.098 8.098 0 0 1-1.24-4.38c0-4.47 3.64-8.11 8.11-8.11 2.16 0 4.2.84 5.73 2.37 1.53 1.53 2.37 3.57 2.37 5.73-.01 4.47-3.65 8.12-8.11 8.12zm4.44-6.07c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-1.54-.77-2.63-1.4-3.67-3.2-.27-.47.27-.44.78-1.46.08-.16.04-.3-.02-.42s-.54-1.3-.74-1.78c-.2-.48-.4-.41-.54-.42-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z"/>
                  </svg>
                </span>
                <a href={`https://wa.me/${settings?.whatsapp_number || '918788818163'}?text=Hello%20Atharva%20Real%20Infra,%20I%20have%20an%20inquiry.`} target="_blank" rel="noopener noreferrer" className="whatsapp-contact-link">
                  WhatsApp Chat
                </a>
              </li>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>✉️</span>
                <a href={`mailto:${settings?.email_address || 'ds200784@atharvarealinfra.com'}`} className="contact-link">
                  {settings?.email_address || 'ds200784@atharvarealinfra.com'}
                </a>
              </li>
            </ul>

            <div style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px' }}>
              <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>Working Hours</h3>
              <p className="text-secondary">Monday - Saturday: 9:00 AM to 7:00 PM</p>
              <p className="text-secondary">Sunday: By appointment only</p>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '3rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>Send an Inquiry</h3>
            <InquiryForm propertyId="" />
          </div>
        </div>
      </div>
    </div>
  );
}
