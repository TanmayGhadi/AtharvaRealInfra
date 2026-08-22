'use client';

import { useState, useEffect } from 'react';
import { createProperty } from '../actions';
import styles from '../../admin.module.css';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

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
    if (lower.includes('guntha')) area = area / 40;
    else if (lower.includes('sqm') || lower.includes('sq meter')) area = area / 4046.86;
    else if (lower.includes('sqft') || lower.includes('sq ft')) area = area / 43560;
    
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

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/') || file.size <= 5 * 1024 * 1024) {
        return resolve(file);
      }
      const img = new window.Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);
        
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.8);
      };
      img.onerror = () => resolve(file);
      img.src = url;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'document') => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    let newFiles = type === 'image' ? [...images] : type === 'video' ? [...videos] : [...documents];
    
    for (let i = 0; i < e.target.files.length; i++) {
      let file = e.target.files[i];
      if (type === 'image') {
        file = await compressImage(file);
      }
      try {
        const sigRes = await fetch('/api/upload-signature', { method: 'POST' });
        const sigData = await sigRes.json();
        
        if (!sigRes.ok || sigData.error) {
          throw new Error(sigData.error || 'Failed to get upload signature');
        }

        const cloudinaryData = new FormData();
        cloudinaryData.append('file', file);
        cloudinaryData.append('api_key', sigData.api_key);
        cloudinaryData.append('timestamp', sigData.timestamp);
        cloudinaryData.append('signature', sigData.signature);
        cloudinaryData.append('folder', 'atharva_real_infra');

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloud_name}/${type === 'video' ? 'video' : type === 'document' ? 'raw' : 'image'}/upload`, {
          method: 'POST',
          body: cloudinaryData,
        });
        
        const result = await uploadRes.json();
        if (!uploadRes.ok || result.error) {
          throw new Error(result.error?.message || result.error || `HTTP error ${uploadRes.status}`);
        }
        
        if (result && result.secure_url) {
          newFiles.push(result.secure_url);
        }
      } catch (err: any) {
        console.error(`Cloudinary ${type} upload failed:`, err);
        alert(`${type} upload failed: ${err.message || 'Unknown error'}. Please try again.`);
      }
    }
    
    if (type === 'image') setImages(newFiles);
    else if (type === 'video') setVideos(newFiles);
    else setDocuments(newFiles);
    setUploading(false);
  };

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveStatus('saving');
    setErrorMessage('');
    
    try {
      const formData = new FormData(e.currentTarget);
      formData.set('images', JSON.stringify(images));
      formData.set('videos', JSON.stringify(videos));
      formData.set('documents', JSON.stringify(documents));
      formData.set('thumbnail_image', images.length > 0 ? images[0] : '');

      const result = await createProperty(formData);
      if (result && result.error) {
        throw new Error(result.error);
      }
      if (result && result.success) {
        setSaveStatus('success');
        setTimeout(() => {
          window.location.href = '/admin/properties';
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      setSaveStatus('error');
      setErrorMessage(err.message || 'Failed to create property.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.8rem 1rem',
    background: '#FFFFFF',
    border: '1px solid rgba(18,49,40,0.25)',
    color: '#17231F',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontWeight: 500
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#123128',
    fontWeight: 700,
    fontSize: '0.85rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#123128', fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: 0 }}>
          Add New Property
        </h1>
        <Link href="/admin/properties" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem', borderColor: '#123128', color: '#123128', fontWeight: 700 }}>
          Back to Properties
        </Link>
      </div>

      {saveStatus === 'success' && (
        <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', color: '#166534', padding: '1rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 700 }}>
          ✓ Property Created Successfully! Redirecting to property management...
        </div>
      )}

      {saveStatus === 'error' && (
        <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '1rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600 }}>
          <span>Error creating property: {errorMessage}</span>
          <button type="button" onClick={() => setSaveStatus('idle')} style={{ background: 'none', border: 'none', color: '#991B1B', cursor: 'pointer', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <img src={previewImage} style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px', border: '2px solid var(--accent-gold)' }} alt="Preview" />
        </div>
      )}

      <div className={styles.card}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Property Title *</label>
              <input type="text" name="title" required placeholder="Luxury Farmhouse Plot Pinguli" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Property Type *</label>
              <select name="property_type" style={inputStyle}>
                <option value="Agricultural Land">Agricultural Land</option>
                <option value="Farmhouse">Farmhouse Plot</option>
                <option value="Commercial">Commercial Land</option>
                <option value="Investment">Investment Plot</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description *</label>
            <textarea name="description" required rows={4} style={inputStyle} placeholder="Detailed property description, features, road access, and view..."></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>District *</label>
              <select name="district" required value={district} onChange={e => { setDistrict(e.target.value); setTaluka(''); setVillage(''); }} style={inputStyle}>
                <option value="">Select District</option>
                {Object.keys(locationHierarchy).map(d => <option key={d} value={d}>{d}</option>)}
                {!Object.keys(locationHierarchy).length && <option value="Sindhudurg">Sindhudurg</option>}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Taluka *</label>
              <select name="taluka" required value={taluka} onChange={e => { setTaluka(e.target.value); setVillage(''); }} style={inputStyle}>
                <option value="">Select Taluka</option>
                {availableTalukas.map(t => <option key={t} value={t}>{t}</option>)}
                {!availableTalukas.length && (
                  <>
                    <option value="Kudal">Kudal</option>
                    <option value="Sawantwadi">Sawantwadi</option>
                    <option value="Dodamarg">Dodamarg</option>
                    <option value="Vengurla">Vengurla</option>
                    <option value="Kankavli">Kankavli</option>
                    <option value="Malvan">Malvan</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Village *</label>
              <input type="text" name="village" required value={village} onChange={e => setVillage(e.target.value)} placeholder="e.g. Pinguli" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Price (Display) *</label>
              <input type="text" name="price_display" required placeholder="₹ 50 Lakh" value={priceDisplay} onChange={handlePriceDisplayChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Price (Numeric) *</label>
              <input type="number" name="price_numeric" required placeholder="5000000" value={priceNumeric} onChange={e => setPriceNumeric(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Area (Display) *</label>
              <input type="text" name="area_display" required placeholder="1 Acre" value={areaDisplay} onChange={handleAreaDisplayChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Price Per Acre (Auto)</label>
              <input type="text" readOnly placeholder="Calculated automatically" value={pricePerAcre} style={{ ...inputStyle, background: '#EDE7DA', color: '#123128', fontWeight: 700 }} />
            </div>
            <div>
              <label style={labelStyle}>Status *</label>
              <select name="status" style={inputStyle}>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Reserved">Reserved</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Latitude (Optional)</label>
              <input type="text" name="latitude" placeholder="e.g. 16.0" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Longitude (Optional)</label>
              <input type="text" name="longitude" placeholder="e.g. 73.5" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#123128', cursor: 'pointer', fontWeight: 700 }}>
              <input type="checkbox" name="is_featured" style={{ width: '18px', height: '18px' }} />
              Feature this property listing prominently on the homepage
            </label>
          </div>

          <input type="hidden" name="videos" value={JSON.stringify(videos)} />
          <input type="hidden" name="documents" value={JSON.stringify(documents)} />

          <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(18,49,40,0.15)', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.75rem', color: '#123128', fontSize: '1.1rem' }}>Property Images (Optional)</h3>
            <p style={{ color: '#5D665F', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Upload high resolution cover photos and gallery images. Images can also be added or edited later.
            </p>
            <div style={{ marginBottom: '1rem' }}>
              <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} disabled={uploading} style={{ padding: '0.5rem', background: '#EDE7DA', borderRadius: '6px', border: '1px solid rgba(18,49,40,0.2)' }} />
              {uploading && <span style={{ marginLeft: '1rem', color: '#123128', fontWeight: 700 }}>Uploading media...</span>}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setPreviewImage(img)}
                  style={{ width: '110px', height: '110px', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px', border: '2px solid #C9A24E', cursor: 'pointer' }}
                ></div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(18,49,40,0.15)', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.75rem', color: '#123128', fontSize: '1.1rem' }}>Property Videos (Optional)</h3>
            <div style={{ marginBottom: '1rem' }}>
              <input type="file" multiple accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} disabled={uploading} style={{ padding: '0.5rem', background: '#EDE7DA', borderRadius: '6px', border: '1px solid rgba(18,49,40,0.2)' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {videos.map((vid, i) => (
                <video key={i} src={vid} style={{ width: '160px', height: '110px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #C9A24E' }} controls />
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(18,49,40,0.15)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link href="/admin/properties" className="btn-outline" style={{ padding: '12px 24px', borderColor: '#123128', color: '#123128', fontWeight: 700 }}>
              Cancel
            </Link>
            <button type="submit" className="btn-primary" style={{ padding: '12px 32px', fontSize: '1rem', backgroundColor: '#123128', color: '#FFFFFF', fontWeight: 700 }} disabled={uploading || saveStatus === 'saving'}>
              {uploading ? 'Uploading Media...' : saveStatus === 'saving' ? 'Creating Property...' : 'Publish Property Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
