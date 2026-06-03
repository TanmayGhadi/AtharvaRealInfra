'use client';

import { useState, useEffect } from 'react';
import { createProperty } from '../actions';
import styles from '../../admin.module.css';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

import { uploadMediaServer } from '../uploadAction';

export default function NewPropertyPage() {
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [district, setDistrict] = useState('');
  const [taluka, setTaluka] = useState('');
  const [village, setVillage] = useState('');
  const [locationHierarchy, setLocationHierarchy] = useState<Record<string, Record<string, string[]>>>({});
  const [priceDisplay, setPriceDisplay] = useState('');
  const [priceNumeric, setPriceNumeric] = useState('');
  const [areaDisplay, setAreaDisplay] = useState('');
  const [pricePerAcre, setPricePerAcre] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handlePriceDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('₹ ') && val.length > 0) {
      val = '₹ ' + val.replace('₹ ', '');
    }
    setPriceDisplay(val);
    
    const numMatch = val.replace(/,/g, '').match(/[\d.]+/);
    let num = 0;
    if (numMatch) {
      num = parseFloat(numMatch[0]);
      const lower = val.toLowerCase();
      if (lower.includes('cr')) num *= 10000000;
      else if (lower.includes('lakh') || lower.includes('lac')) num *= 100000;
      else if (lower.includes('k') || lower.includes('thousand')) num *= 1000;
      setPriceNumeric(num.toString());
    } else {
      setPriceNumeric('');
    }
    calculatePerAcre(num, areaDisplay);
  };

  const handleAreaDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAreaDisplay(val);
    calculatePerAcre(parseFloat(priceNumeric || '0'), val);
  };

  const calculatePerAcre = (priceNum: number, areaStr: string) => {
    if (!priceNum || !areaStr) {
      setPricePerAcre('');
      return;
    }
    const lower = areaStr.toLowerCase();
    const numMatch = areaStr.replace(/,/g, '').match(/[\d.]+/);
    if (!numMatch) {
      setPricePerAcre('');
      return;
    }
    let area = parseFloat(numMatch[0]);
    if (lower.includes('guntha')) area = area / 40; // 40 gunthas in an acre
    else if (lower.includes('sqm') || lower.includes('sq meter')) area = area / 4046.86;
    else if (lower.includes('sqft') || lower.includes('sq ft')) area = area / 43560;
    // defaults to acres if 'acre' is in string or if no recognizable unit
    
    if (area > 0) {
      const perAcre = priceNum / area;
      if (perAcre >= 10000000) setPricePerAcre(`₹ ${(perAcre / 10000000).toFixed(2)} Cr`);
      else if (perAcre >= 100000) setPricePerAcre(`₹ ${(perAcre / 100000).toFixed(2)} Lakh`);
      else setPricePerAcre(`₹ ${perAcre.toLocaleString()}`);
    } else {
      setPricePerAcre('');
    }
  };

  useEffect(() => {
    async function fetchLocations() {
      const { data, error } = await supabase.from('villages').select('name, talukas(name, districts(name))');
      if (error || !data) return;
      
      const hierarchy: Record<string, Record<string, string[]>> = {};
      data.forEach((v: any) => {
        const villageName = v.name;
        const talukaName = v.talukas?.name;
        const districtName = v.talukas?.districts?.name;
        
        if (!districtName || !talukaName || !villageName) return;
        
        if (!hierarchy[districtName]) hierarchy[districtName] = {};
        if (!hierarchy[districtName][talukaName]) hierarchy[districtName][talukaName] = [];
        if (!hierarchy[districtName][talukaName].includes(villageName)) {
          hierarchy[districtName][talukaName].push(villageName);
        }
      });
      setLocationHierarchy(hierarchy);
    }
    fetchLocations();
  }, []);

  const availableTalukas = district ? Object.keys(locationHierarchy[district] || {}) : [];
  const availableVillages = district && taluka ? locationHierarchy[district][taluka] || [] : [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'document') => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const newFiles = type === 'image' ? [...images] : type === 'video' ? [...videos] : [...documents];
    
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type === 'document' ? 'raw' : type); 

      try {
        const result: any = await uploadMediaServer(formData);
        if (result && result.url) {
          newFiles.push(result.url);
        }
      } catch (err) {
        console.error(`Cloudinary ${type} upload failed:`, err);
        alert(`${type} upload failed. Please try again.`);
      }
    }
    
    if (type === 'image') setImages(newFiles);
    else if (type === 'video') setVideos(newFiles);
    else setDocuments(newFiles);
    setUploading(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Add New Property</h1>
        <Link href="/admin/properties" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          Cancel
        </Link>
      </div>

      {/* Lightbox Overlay */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <img src={previewImage} style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px', border: '2px solid var(--accent-gold)' }} alt="Preview" />
        </div>
      )}

      <div className={styles.card}>
        <form action={createProperty} style={{ display: 'grid', gap: '1.5rem' }}>
          {/* We use a hidden input to pass the images array to the server action */}
          <input type="hidden" name="images" value={JSON.stringify(images)} />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Property Title</label>
              <input type="text" name="title" required placeholder="Luxury Farmhouse Estate" style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Property Type</label>
              <select name="property_type" style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }}>
                <option value="Agricultural">Agricultural Land</option>
                <option value="Farmhouse">Farmhouse Plot</option>
                <option value="Commercial">Commercial Land</option>
                <option value="Investment">Investment Plot</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Description</label>
            <textarea name="description" required rows={4} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }}></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>District</label>
              <select name="district" required value={district} onChange={e => { setDistrict(e.target.value); setTaluka(''); setVillage(''); }} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }}>
                <option value="">Select District</option>
                {Object.keys(locationHierarchy).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Taluka</label>
              <select name="taluka" required value={taluka} onChange={e => { setTaluka(e.target.value); setVillage(''); }} disabled={!district} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }}>
                <option value="">Select Taluka</option>
                {availableTalukas.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Village (Optional)</label>
              <select name="village" value={village} onChange={e => setVillage(e.target.value)} disabled={!taluka} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }}>
                <option value="">Select Village</option>
                {availableVillages.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Price (Display)</label>
              <input type="text" name="price_display" required placeholder="₹ 2.5 Cr" value={priceDisplay} onChange={handlePriceDisplayChange} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Price (Numeric for sorting)</label>
              <input type="number" name="price_numeric" required placeholder="25000000" value={priceNumeric} onChange={e => setPriceNumeric(e.target.value)} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Area (Display)</label>
              <input type="text" name="area_display" required placeholder="5 Acres" value={areaDisplay} onChange={handleAreaDisplayChange} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Price Per Acre (Auto-Calculated)</label>
              <input type="text" readOnly placeholder="Calculated automatically" value={pricePerAcre} style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--accent-gold)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Status</label>
              <select name="status" style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }}>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Latitude (Optional for Map)</label>
              <input type="text" name="latitude" placeholder="e.g. 15.9033" style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Longitude (Optional for Map)</label>
              <input type="text" name="longitude" placeholder="e.g. 73.8211" style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input type="checkbox" name="is_featured" />
              Feature this property on the homepage
            </label>
          </div>

          <input type="hidden" name="videos" value={JSON.stringify(videos)} />
          <input type="hidden" name="documents" value={JSON.stringify(documents)} />
          <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Property Images</h3>
            <div style={{ marginBottom: '1rem' }}>
              <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} disabled={uploading} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
              {uploading && <span style={{ marginLeft: '1rem', color: 'var(--accent-gold)' }}>Uploading to Cloudinary...</span>}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setPreviewImage(img)}
                  style={{ width: '100px', height: '100px', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px', border: '2px solid var(--accent-gold)', cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                ></div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Property Videos</h3>
            <div style={{ marginBottom: '1rem' }}>
              <input type="file" multiple accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} disabled={uploading} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {videos.map((vid, i) => (
                <video key={i} src={vid} style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--accent-gold)' }} controls />
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Property Documents (PDFs, etc)</h3>
            <div style={{ marginBottom: '1rem' }}>
              <input type="file" multiple accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'document')} disabled={uploading} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {documents.map((doc, i) => (
                <a key={i} href={doc} target="_blank" rel="noopener noreferrer" style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', color: 'var(--accent-gold)' }}>Document {i + 1}</a>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }} disabled={uploading}>
            Publish Property
          </button>
        </form>
      </div>
    </div>
  );
}
