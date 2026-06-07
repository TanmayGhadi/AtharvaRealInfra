'use client';

import { useState, useEffect, useRef, use } from 'react';
import { updateProperty, getProperty, getLocations } from '../../actions';
import styles from '../../../admin.module.css';
import Link from 'next/link';

import { uploadMediaServer } from '../../uploadAction';

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'document', replaceIdx: number | null = null) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    let newFiles = type === 'image' ? [...images] : type === 'video' ? [...videos] : [...documents];
    
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type === 'document' ? 'raw' : type); 

      try {
        const result: any = await uploadMediaServer(formData);
        if (result && result.url) {
          if (replaceIdx !== null) {
            newFiles[replaceIdx] = result.url;
            if (thumbnailImage === images[replaceIdx]) {
              setThumbnailImage(result.url);
            }
          } else {
            newFiles.push(result.url);
            if (type === 'image' && newFiles.length === 1 && !thumbnailImage) {
              setThumbnailImage(result.url);
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

  // Image Management
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

  // Amenities Management
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
      // Append complex fields
      formData.set('images', JSON.stringify(images));
      formData.set('thumbnail_image', thumbnailImage || '');
      formData.set('amenities', JSON.stringify(amenities));
      formData.set('videos', JSON.stringify(videos));
      formData.set('documents', JSON.stringify(documents));

      await updateProperty(property.id, formData);
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      console.error(err);
      setSaveStatus('error');
      setErrorMessage(err.message || 'Failed to save property.');
    }
  };

  if (loading) return <div style={{ padding: '2rem', color: 'white' }}>Loading property details...</div>;
  if (!property) return <div style={{ padding: '2rem', color: '#f87171' }}>Property not found.</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Edit Property</h1>
        <Link href="/admin/properties" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          Back to Properties
        </Link>
      </div>

      {saveStatus === 'success' && (
        <div style={{ background: 'rgba(74, 222, 128, 0.2)', border: '1px solid #4ade80', color: '#4ade80', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Changes Saved Successfully! Data is permanently stored.</span>
          <button onClick={() => setSaveStatus('idle')} style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {saveStatus === 'error' && (
        <div style={{ background: 'rgba(248, 113, 113, 0.2)', border: '1px solid #f87171', color: '#f87171', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Error saving property: {errorMessage}</span>
          <button onClick={() => setSaveStatus('idle')} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>✕</button>
        </div>
      )}

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
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>

          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Property Title / Name</label>
              <input type="text" name="title" defaultValue={property.title} required style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Property Type</label>
              <select name="property_type" defaultValue={property.property_type} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }}>
                <option value="Agricultural">Agricultural Land</option>
                <option value="Farmhouse">Farmhouse Plot</option>
                <option value="Commercial">Commercial Land</option>
                <option value="Investment">Investment Plot</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Description</label>
            <textarea name="description" defaultValue={property.description} required rows={4} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }}></textarea>
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
              <input type="text" name="price_display" required value={priceDisplay} onChange={handlePriceDisplayChange} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Price (Numeric for sorting)</label>
              <input type="number" name="price_numeric" required value={priceNumeric} onChange={e => setPriceNumeric(e.target.value)} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Area (Display)</label>
              <input type="text" name="area_display" required value={areaDisplay} onChange={handleAreaDisplayChange} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Price Per Acre (Auto-Calculated)</label>
              <input type="text" readOnly placeholder="Calculated automatically" value={pricePerAcre} style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--accent-gold)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Status</label>
              <select name="status" defaultValue={property.status} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }}>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Amenities</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input 
                type="text" 
                value={amenityInput} 
                onChange={(e) => setAmenityInput(e.target.value)} 
                placeholder="e.g. Electricity, Water Supply..." 
                style={{ flex: 1, padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} 
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAmenity(); } }}
              />
              <button type="button" onClick={addAmenity} className="btn-primary" style={{ padding: '0 1.5rem' }}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {amenities.map((am, i) => (
                <div key={i} style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--accent-gold)', padding: '0.4rem 0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{am}</span>
                  <button type="button" onClick={() => removeAmenity(i)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0 4px' }}>&times;</button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>SEO Settings</h3>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>SEO Friendly Slug (URL)</label>
                <input type="text" name="slug" value={slug} onChange={e => setSlug(e.target.value)} placeholder="e.g. premium-agricultural-land-kankavli" style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>SEO Title</label>
                <input type="text" name="seo_title" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} placeholder="e.g. Premium Agricultural Land in Kankavli | Atharva Real Infra" style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>SEO Description</label>
                <textarea name="seo_description" value={seoDescription} onChange={e => setSeoDescription(e.target.value)} rows={2} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }}></textarea>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>SEO Keywords</label>
                <input type="text" name="seo_keywords" value={seoKeywords} onChange={e => setSeoKeywords(e.target.value)} placeholder="e.g. property in maharashtra, agricultural land near goa" style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid rgba(212,175,55,0.2)', color: 'white', borderRadius: '4px' }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1rem' }}>
              <input type="checkbox" name="is_featured" defaultChecked={property.is_featured} />
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Feature this property on the homepage</span>
            </label>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Image Management</h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} disabled={uploading} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
              {uploading && <span style={{ marginLeft: '1rem', color: 'var(--accent-gold)' }}>Uploading to Cloudinary...</span>}
            </div>
            
            {/* Hidden input for replace */}
            <input type="file" ref={replaceFileRef} accept="image/*" onChange={(e) => replaceIndex !== null && handleFileUpload(e, 'image', replaceIndex)} style={{ display: 'none' }} />

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {images.map((img, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px', border: thumbnailImage === img ? '2px solid var(--accent-gold)' : '2px solid transparent' }}>
                  <div 
                    onClick={() => setPreviewImage(img)}
                    style={{ width: '150px', height: '150px', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px', cursor: 'pointer', position: 'relative' }}
                  >
                    {thumbnailImage === img && <div style={{ position: 'absolute', top: '5px', left: '5px', background: 'var(--accent-gold)', color: '#000', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>THUMBNAIL</div>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => moveImage(i, 'up')} disabled={i === 0} style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'var(--bg-primary)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', cursor: i === 0 ? 'not-allowed' : 'pointer' }}>↑</button>
                    <button type="button" onClick={() => moveImage(i, 'down')} disabled={i === images.length - 1} style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'var(--bg-primary)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', cursor: i === images.length - 1 ? 'not-allowed' : 'pointer' }}>↓</button>
                    <button type="button" onClick={() => setThumbnailImage(img)} style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'var(--bg-primary)', color: 'var(--accent-gold)', border: '1px solid rgba(212,175,55,0.5)', borderRadius: '4px', cursor: 'pointer' }}>Set Thumb</button>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                    <button type="button" onClick={() => triggerReplaceImage(i)} style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'var(--bg-primary)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', cursor: 'pointer', flex: 1 }}>Replace</button>
                    <button type="button" onClick={() => deleteImage(i)} style={{ padding: '4px 8px', fontSize: '0.8rem', background: '#f87171', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', flex: 1 }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '1.5rem', display: 'flex', gap: '2rem' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '1rem' }}>Property Videos</h3>
              <div style={{ marginBottom: '1rem' }}>
                <input type="file" multiple accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} disabled={uploading} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {videos.map((vid, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <video src={vid} style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }} controls />
                    <button type="button" onClick={() => setVideos(videos.filter((_, idx) => idx !== i))} style={{ padding: '4px', background: '#f87171', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete Video</button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '1rem' }}>Property Documents</h3>
              <div style={{ marginBottom: '1rem' }}>
                <input type="file" multiple accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'document')} disabled={uploading} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flexDirection: 'column' }}>
                {documents.map((doc, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
                    <a href={doc} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)' }}>Document {i + 1}</a>
                    <button type="button" onClick={() => setDocuments(documents.filter((_, idx) => idx !== i))} style={{ padding: '4px 8px', background: '#f87171', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(212,175,55,0.5)', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link href="/admin/properties" className="btn-outline" style={{ padding: '12px 24px' }}>
              Cancel
            </Link>
            <button type="submit" className="btn-primary" style={{ padding: '12px 32px', fontSize: '1.1rem' }} disabled={uploading || saveStatus === 'saving'}>
              {uploading ? 'Uploading...' : saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
