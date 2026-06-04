import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";
import { getServiceSupabase } from "@/lib/supabase";
import InquiryForm from "@/components/InquiryForm";
import MediaGallery from "@/components/MediaGallery";
import PropertyCard from "@/components/PropertyCard";

export default async function PropertyDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = getServiceSupabase();
  const { data: prop, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  const { data: settings } = await supabase.from('settings').select('*').single();

  if (error || !prop) {
    return <div className="section-container text-center" style={{paddingTop: '150px'}}><h2>Property not found</h2></div>;
  }
  
  // Fetch similar properties
  const { data: similarProps } = await supabase
    .from('properties')
    .select('*')
    .eq('district', prop.district)
    .neq('id', prop.id)
    .limit(4);

  let suggestedProperties = similarProps || [];
  if (suggestedProperties.length < 4) {
    const { data: otherProps } = await supabase
      .from('properties')
      .select('*')
      .neq('id', prop.id)
      .neq('district', prop.district)
      .limit(4 - suggestedProperties.length);
    if (otherProps) {
      suggestedProperties = [...suggestedProperties, ...otherProps];
    }
  }
  
  let parsedVideos = [];
  try { parsedVideos = typeof prop.videos === 'string' ? JSON.parse(prop.videos) : prop.videos; } catch(e) {}
  if (!Array.isArray(parsedVideos)) parsedVideos = [];
  
  let parsedDocuments = [];
  try { parsedDocuments = typeof prop.documents === 'string' ? JSON.parse(prop.documents) : prop.documents; } catch(e) {}
  if (!Array.isArray(parsedDocuments)) parsedDocuments = [];
  return (
    <div className={styles.propertyDetailsPage}>
      {/* Gallery Section */}
      <MediaGallery images={prop.images} />

      <div className="section-container">
        <div className={styles.layout}>
          {/* Main Content */}
          <div className={styles.content}>
            <div className={styles.header}>
              <div className={styles.badge}>{prop.property_type || 'Premium'}</div>
              <h1>{prop.title}</h1>
              <p className={styles.location}>📍 {prop.village}, {prop.taluka}, {prop.district}, Maharashtra</p>
              
              <div className={styles.keyStats}>
                <div className={styles.statBox}>
                  <span>Price</span>
                  <h4>{prop.price_display}</h4>
                </div>
                <div className={styles.statBox}>
                  <span>Area</span>
                  <h4>{prop.area_display}</h4>
                </div>
                <div className={styles.statBox}>
                  <span>Status</span>
                  <h4 className="text-gold">{prop.status}</h4>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2>Property Overview</h2>
              <p style={{ whiteSpace: 'pre-line' }}>{prop.description}</p>
            </div>

            <div className={styles.section}>
              <h2>Investment Highlights</h2>
              <ul className={styles.featuresList}>
                <li>Clear marketable title with 7/12 extract</li>
                <li>Demarcated boundaries with fencing</li>
                <li>24/7 water availability</li>
                {prop.near_airport && <li>Near Mopa Airport</li>}
                {prop.near_highway && <li>Near NH-66 Highway</li>}
              </ul>
            </div>

            <div className={styles.section}>
              <h2>Location Map</h2>
              <div className={styles.mapContainer} style={{ height: '400px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
                {prop.latitude && prop.longitude ? (
                  <>
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://maps.google.com/maps?q=${prop.latitude},${prop.longitude}&z=14&output=embed`}
                      allowFullScreen
                    ></iframe>
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 10 }}>
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${prop.latitude},${prop.longitude}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-primary"
                        style={{ padding: '10px 20px', fontSize: '0.9rem', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}
                      >
                        Get Directions
                      </a>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                    Map coordinates not provided for this property.
                  </div>
                )}
              </div>
            </div>

            {parsedVideos && parsedVideos.length > 0 && (
              <div className={styles.section}>
                <h2>Video Tour</h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {parsedVideos.map((vid: string, i: number) => (
                    <video key={i} controls style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--border-color)' }} src={vid} />
                  ))}
                </div>
              </div>
            )}

            {parsedDocuments && parsedDocuments.length > 0 && (
              <div className={styles.section}>
                <h2>Property Documents</h2>
                <ul className={styles.featuresList}>
                  {parsedDocuments.map((doc: string, i: number) => (
                    <li key={i}><a href={doc} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)' }}>View Document {i + 1} 📄</a></li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.contactCard}>
              <h3>Interested in this property?</h3>
              <p>Contact our luxury real estate experts for a private viewing or more details.</p>
              
              <div className={styles.actions}>
                <a href={`tel:${settings?.phone_number || '+917843097793'}`} className="btn-primary" style={{display: 'block', textAlign: 'center'}}>Call Now</a>
                <a href={`https://wa.me/${settings?.whatsapp_number || '917843097793'}?text=${encodeURIComponent(`Hello, I am interested in property: ${prop.title} (ID: ${prop.id}). Please provide more details. URL: https://atharvarealinfra.com/properties/${prop.id}`)}`} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{display: 'block', textAlign: 'center'}}>WhatsApp</a>
                <a href={`mailto:${settings?.email_address || 'ds200784@atharvarealinfra.com'}`} className="btn-outline" style={{display: 'block', textAlign: 'center'}}>Email Us</a>
              </div>

              <div className={styles.divider}>or</div>

              <InquiryForm propertyId={prop.id} propertyTitle={prop.title} />

              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <p style={{ marginBottom: '1rem' }}><strong>Office Address:</strong><br/>{settings?.office_address || 'Samartha Residency, Janavali, Kankavli near NH 66'}</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {settings?.instagram_url ? <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)' }}>Instagram</a> : <a href="https://instagram.com/atharvarealinfar" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)' }}>Instagram</a>}
                  {settings?.facebook_url ? <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)' }}>Facebook</a> : <a href="https://www.facebook.com/profile.php?id=61590608871679" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)' }}>Facebook</a>}
                  {settings?.youtube_url ? <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)' }}>YouTube</a> : <a href="https://www.youtube.com/@AtharvaRealInfra" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)' }}>YouTube</a>}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Suggested Properties */}
      {suggestedProperties.length > 0 && (
        <div className="section-container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Suggested Properties</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {suggestedProperties.map((p, idx) => (
              <PropertyCard key={p.id} prop={p} index={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
