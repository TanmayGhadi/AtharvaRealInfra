'use client';

import { useState, useEffect, useRef } from 'react';
import { updateProperty, getProperty, getLocations } from '../../actions';
import styles from '../../../admin.module.css';
import Link from 'next/link';

export default function EditPropertyPage({ params }: { params: any }) {
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<any>(null);
  
  // Media State
  const [images, setImages] = useState<string[]>([]);
  const [thumbnailImage, setThumbnailImage] = useState<string | null>(null);
  const [videos, setVideos] = useState<string[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Property Details State
  const [district, setDistrict] = useState('');
  const [taluka, setTaluka] = useState('');
  const [village, setVillage] = useState('');
  const [locationHierarchy, setLocationHierarchy] = useState<Record<string, Record<string, string[]>>>({});
  const [priceDisplay, setPriceDisplay] = useState('');
  const [priceNumeric, setPriceNumeric] = useState('');
  const [areaDisplay, setAreaDisplay] = useState('');
  const [pricePerAcre, setPricePerAcre] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // SEO & Extra Fields State
  const [slug, setSlug] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  
  // Amenities
  const [amenities, setAmenities] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState('');

  // Hidden File inputs for replace
  const replaceFileRef = useRef<HTMLInputElement | null>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProperty() {
      let currentId = params.id;
      if (!currentId && params instanceof Promise) {
         const p = await params;
         currentId = p.id;
      }
      
      const data = await getProperty(currentId);
      if (data) {
        setProperty(data);
        setDistrict(data.district || '');
        setTaluka(data.taluka || '');
        setVillage(data.village || '');
        setPriceDisplay(data.price_display || '');
        setPriceNumeric(data.price_numeric ? data.price_numeric.toString() : '');
        setAreaDisplay(data.area_display || '');
        
        setImages(data.images || []);
        setThumbnailImage(data.thumbnail_image || (data.images && data.images[0]) || null);
        setVideos(data.videos || []);
        setDocuments(data.documents || []);
        
        setSlug(data.slug || '');
        setSeoTitle(data.seo_title || '');
        setSeoDescription(data.seo_description || '');
        setSeoKeywords(data.seo_keywords || '');
        setAmenities(data.amenities || []);
        
        if (data.price_numeric && data.area_display) {
          const numMatch = data.area_display.replace(/,/g, '').match(/[\d.]+/);
          if (numMatch) {
            let area = parseFloat(numMatch[0]);
            const lower = data.area_display.toLowerCase();
            if (lower.includes('guntha')) area = area / 40;
            else if (lower.includes('sqm') || lower.includes('sq meter')) area = area / 4046.86;
            else if (lower.includes('sqft') || lower.includes('sq ft')) area = area / 43560;
            
            if (area > 0) {
              const perAcre = data.price_numeric / area;
              if (perAcre >= 10000000) setPricePerAcre(`₹ ${(perAcre / 10000000).toFixed(2)} Cr`);
              else if (perAcre >= 100000) setPricePerAcre(`₹ ${(perAcre / 100000).toFixed(2)} Lakh`);
              else setPricePerAcre(`₹ ${perAcre.toLocaleString()}`);
            }
          }
        }
      }
      setLoading(false);
    }
    fetchProperty();
  }, [params]);

  useEffect(() => {
    async function fetchLocations() {
      const data = await getLocations();
      if (!data) return;
      
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'document', replaceIdx: number | null = null) => {
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
          const url = result.secure_url;
          if (replaceIdx !== null) {
            newFiles[replaceIdx] = url;
            if (thumbnailImage === images[replaceIdx]) {
              setThumbnailImage(url);
            }
          } else {
            newFiles.push(url);
            if (type === 'image' && newFiles.length === 1 && !thumbnailImage) {
              setThumbnailImage(url);
            }
          }
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
    if (replaceIdx !== null && replaceFileRef.current) {
      replaceFileRef.current.value = '';
    }
    setReplaceIndex(null);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;
    const newImages = [...images];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
    setImages(newImages);
  };

  const deleteImage = (index: number) => {
    const isThumb = images[index] === thumbnailImage;
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (isThumb) {
      setThumbnailImage(newImages.length > 0 ? newImages[0] : null);
    }
  };

  const triggerReplaceImage = (index: number) => {
    setReplaceIndex(index);
    if (replaceFileRef.current) {
      replaceFileRef.current.click();
    }
  };

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setAmenities([...amenities, amenityInput.trim()]);
      setAmenityInput('');
    }
  };

  const removeAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
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
      formData.set('thumbnail_image', thumbnailImage || '');
      formData.set('amenities', JSON.stringify(amenities));
      formData.set('videos', JSON.stringify(videos));
      formData.set('documents', JSON.stringify(documents));

      const result = await updateProperty(property.id, formData);
      if (result && result.error) {
        throw new Error(result.error);
      }
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      console.error(err);
      setSaveStatus('error');
      setErrorMessage(err.message || 'Failed to save property.');
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

  if (loading) return <div style={{ padding: '3rem', color: '#123128', fontWeight: 700, textAlign: 'center' }}>Loading property details...</div>;
  if (!property) return <div style={{ padding: '3rem', color: '#991B1B', fontWeight: 700, textAlign: 'center' }}>Property not found.</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#123128', fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: 0 }}>
          Edit Property: <span style={{ color: '#C9A24E' }}>{property.title}</span>
        </h1>
        <Link href="/admin/properties" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem', borderColor: '#123128', color: '#123128', fontWeight: 700 }}>
          Back to Properties
        </Link>
      </div>

      {saveStatus === 'success' && (
        <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', color: '#166534', padding: '1rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700 }}>
          <span>✓ Changes Saved Successfully! Data updated permanently.</span>
          <button type="button" onClick={() => setSaveStatus('idle')} style={{ background: 'none', border: 'none', color: '#166534', cursor: 'pointer', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {saveStatus === 'error' && (
        <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '1rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600 }}>
          <span>Error saving property: {errorMessage}</span>
          <button type="button" onClick={() => setSaveStatus('idle')} style={{ background: 'none', border: 'none', color: '#991B1B', cursor: 'pointer', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <img src={previewImage} style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px', border: '2px solid #C9A24E' }} alt="Preview" />
        </div>
      )}

      <div className={styles.card}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Property Title / Name *</label>
              <input type="text" name="title" defaultValue={property.title} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Property Type *</label>
              <select name="property_type" defaultValue={property.property_type || 'Agricultural Land'} style={inputStyle}>
                <option value="Agricultural Land">Agricultural Land</option>
                <option value="Farmhouse">Farmhouse Plot</option>
                <option value="Commercial">Commercial Land</option>
                <option value="Investment">Investment Plot</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description *</label>
            <textarea name="description" defaultValue={property.description} required rows={4} style={inputStyle}></textarea>
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
              <input type="text" name="village" required value={village} onChange={e => setVillage(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Price (Display) *</label>
              <input type="text" name="price_display" required value={priceDisplay} onChange={handlePriceDisplayChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Price (Numeric) *</label>
              <input type="number" name="price_numeric" required value={priceNumeric} onChange={e => setPriceNumeric(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Area (Display) *</label>
              <input type="text" name="area_display" required value={areaDisplay} onChange={handleAreaDisplayChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Price Per Acre (Auto)</label>
              <input type="text" readOnly placeholder="Calculated automatically" value={pricePerAcre} style={{ ...inputStyle, background: '#EDE7DA', color: '#123128', fontWeight: 700 }} />
            </div>
            <div>
              <label style={labelStyle}>Status *</label>
              <select name="status" defaultValue={property.status || 'Available'} style={inputStyle}>
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
              <input type="text" name="latitude" defaultValue={property.latitude || ''} placeholder="e.g. 16.0" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Longitude (Optional)</label>
              <input type="text" name="longitude" defaultValue={property.longitude || ''} placeholder="e.g. 73.5" style={inputStyle} />
            </div>
          </div>

          <div style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(18,49,40,0.15)', paddingTop: '1.25rem' }}>
            <h3 style={{ marginBottom: '0.75rem', color: '#123128', fontSize: '1.1rem' }}>Amenities</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input 
                type="text" 
                value={amenityInput} 
                onChange={(e) => setAmenityInput(e.target.value)} 
                placeholder="e.g. Road Access, Water Supply, River View..." 
                style={{ ...inputStyle, flex: 1 }} 
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAmenity(); } }}
              />
              <button type="button" onClick={addAmenity} className="btn-primary" style={{ padding: '0 1.5rem', backgroundColor: '#123128', color: '#FFFFFF', fontWeight: 700 }}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {amenities.map((am, i) => (
                <div key={i} style={{ background: '#EDE7DA', border: '1px solid rgba(18,49,40,0.2)', padding: '0.4rem 0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#123128', fontWeight: 600 }}>
                  <span>{am}</span>
                  <button type="button" onClick={() => removeAmenity(i)} style={{ background: 'none', border: 'none', color: '#991B1B', cursor: 'pointer', fontWeight: 700, padding: '0 4px' }}>&times;</button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(18,49,40,0.15)', paddingTop: '1.25rem' }}>
            <h3 style={{ marginBottom: '0.75rem', color: '#123128', fontSize: '1.1rem' }}>SEO Settings</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>SEO Friendly Slug (URL)</label>
                <input type="text" name="slug" value={slug} onChange={e => setSlug(e.target.value)} placeholder="e.g. premium-agricultural-land-kankavli" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>SEO Title</label>
                <input type="text" name="seo_title" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} placeholder="e.g. Premium Agricultural Land in Kankavli | Atharva Real Infra" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>SEO Description</label>
                <textarea name="seo_description" value={seoDescription} onChange={e => setSeoDescription(e.target.value)} rows={2} style={inputStyle}></textarea>
              </div>
              <div>
                <label style={labelStyle}>SEO Keywords</label>
                <input type="text" name="seo_keywords" value={seoKeywords} onChange={e => setSeoKeywords(e.target.value)} placeholder="e.g. property in maharashtra, agricultural land near goa" style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(18,49,40,0.15)', paddingTop: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#123128', cursor: 'pointer', fontWeight: 700 }}>
              <input type="checkbox" name="is_featured" defaultChecked={property.is_featured} style={{ width: '18px', height: '18px' }} />
              <span>Feature this property listing on the homepage</span>
            </label>
          </div>

          {/* Media Section: Images, Videos, Replace, Reorder */}
          <div style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(18,49,40,0.15)', paddingTop: '1.25rem' }}>
            <h3 style={{ marginBottom: '0.75rem', color: '#123128', fontSize: '1.1rem' }}>Image Management</h3>
            <p style={{ color: '#5D665F', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Add, remove, reorder, replace, or set cover thumbnail image.
            </p>
            <div style={{ marginBottom: '1.25rem' }}>
              <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} disabled={uploading} style={{ padding: '0.5rem', background: '#EDE7DA', borderRadius: '6px', border: '1px solid rgba(18,49,40,0.2)' }} />
              {uploading && <span style={{ marginLeft: '1rem', color: '#123128', fontWeight: 700 }}>Uploading media...</span>}
            </div>
            
            <input type="file" ref={replaceFileRef} accept="image/*" onChange={(e) => replaceIndex !== null && handleFileUpload(e, 'image', replaceIndex)} style={{ display: 'none' }} />

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {images.map((img, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#EDE7DA', padding: '0.6rem', borderRadius: '8px', border: thumbnailImage === img ? '2px solid #C9A24E' : '1px solid rgba(18,49,40,0.15)' }}>
                  <div 
                    onClick={() => setPreviewImage(img)}
                    style={{ width: '140px', height: '140px', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '6px', cursor: 'pointer', position: 'relative' }}
                  >
                    {thumbnailImage === img && (
                      <div style={{ position: 'absolute', top: '5px', left: '5px', background: '#123128', color: '#C9A24E', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                        THUMBNAIL
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => moveImage(i, 'up')} disabled={i === 0} style={{ padding: '3px 7px', fontSize: '0.75rem', background: '#FFFFFF', color: '#123128', border: '1px solid rgba(18,49,40,0.2)', borderRadius: '4px', cursor: i === 0 ? 'not-allowed' : 'pointer', fontWeight: 700 }}>↑</button>
                    <button type="button" onClick={() => moveImage(i, 'down')} disabled={i === images.length - 1} style={{ padding: '3px 7px', fontSize: '0.75rem', background: '#FFFFFF', color: '#123128', border: '1px solid rgba(18,49,40,0.2)', borderRadius: '4px', cursor: i === images.length - 1 ? 'not-allowed' : 'pointer', fontWeight: 700 }}>↓</button>
                    <button type="button" onClick={() => setThumbnailImage(img)} style={{ padding: '3px 7px', fontSize: '0.75rem', background: '#123128', color: '#C9A24E', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}>Set Cover</button>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                    <button type="button" onClick={() => triggerReplaceImage(i)} style={{ padding: '3px 7px', fontSize: '0.75rem', background: '#FFFFFF', color: '#123128', border: '1px solid rgba(18,49,40,0.2)', borderRadius: '4px', cursor: 'pointer', flex: 1, fontWeight: 600 }}>Replace</button>
                    <button type="button" onClick={() => deleteImage(i)} style={{ padding: '3px 7px', fontSize: '0.75rem', background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', borderRadius: '4px', cursor: 'pointer', flex: 1, fontWeight: 700 }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(18,49,40,0.15)', paddingTop: '1.25rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <h3 style={{ marginBottom: '0.75rem', color: '#123128', fontSize: '1.1rem' }}>Property Videos</h3>
              <div style={{ marginBottom: '1rem' }}>
                <input type="file" multiple accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} disabled={uploading} style={{ padding: '0.5rem', background: '#EDE7DA', borderRadius: '6px', border: '1px solid rgba(18,49,40,0.2)' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {videos.map((vid, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <video src={vid} style={{ width: '160px', height: '100px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(18,49,40,0.2)' }} controls />
                    <button type="button" onClick={() => setVideos(videos.filter((_, idx) => idx !== i))} style={{ padding: '4px', background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem' }}>Delete Video</button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '280px' }}>
              <h3 style={{ marginBottom: '0.75rem', color: '#123128', fontSize: '1.1rem' }}>Property Documents</h3>
              <div style={{ marginBottom: '1rem' }}>
                <input type="file" multiple accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'document')} disabled={uploading} style={{ padding: '0.5rem', background: '#EDE7DA', borderRadius: '6px', border: '1px solid rgba(18,49,40,0.2)' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', flexDirection: 'column' }}>
                {documents.map((doc, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#EDE7DA', padding: '0.5rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(18,49,40,0.15)' }}>
                    <a href={doc} target="_blank" rel="noopener noreferrer" style={{ color: '#123128', fontWeight: 700, textDecoration: 'underline' }}>Document {i + 1}</a>
                    <button type="button" onClick={() => setDocuments(documents.filter((_, idx) => idx !== i))} style={{ padding: '3px 8px', background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem' }}>Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(18,49,40,0.15)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link href="/admin/properties" className="btn-outline" style={{ padding: '12px 24px', borderColor: '#123128', color: '#123128', fontWeight: 700 }}>
              Cancel
            </Link>
            <button type="submit" className="btn-primary" style={{ padding: '12px 32px', fontSize: '1rem', backgroundColor: '#123128', color: '#FFFFFF', fontWeight: 700 }} disabled={uploading || saveStatus === 'saving'}>
              {uploading ? 'Uploading Media...' : saveStatus === 'saving' ? 'Saving Changes...' : 'Save Property Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
