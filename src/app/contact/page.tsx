import InquiryForm from "@/components/InquiryForm";
import styles from "../properties/[id]/page.module.css"; // Reuse styling
import homeStyles from "../page.module.css";

export default function ContactPage() {
  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
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
            <p className="text-secondary" style={{ marginBottom: '2rem', lineHeight: '1.8' }}>
              Samartha Residency, Janavali<br/>
              Kankavli near NH 66
            </p>

            <h3 style={{ marginBottom: '1rem' }}>Direct Contact</h3>
            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)' }}>
              <li style={{ marginBottom: '0.8rem' }}>📞 +91 7843097793</li>
              <li style={{ marginBottom: '0.8rem' }}>✉️ ds200784@atharvarealinfra.com</li>
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
