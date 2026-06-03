'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from '../app/properties/page.module.css';
import { supabase } from '@/lib/supabase';

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [locationHierarchy, setLocationHierarchy] = useState<Record<string, Record<string, string[]>>>({});

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

  const [filters, setFilters] = useState({
    district: searchParams.getAll('district'),
    taluka: searchParams.getAll('taluka'),
    village: searchParams.getAll('village'),
    type: searchParams.getAll('type'),
    status: searchParams.getAll('status'),
    budget: searchParams.get('budget') || 'any',
    area: searchParams.get('area') || 'any',
    featured: searchParams.get('featured') === 'true',
    near_airport: searchParams.get('near_airport') === 'true',
    near_nh66: searchParams.get('near_nh66') === 'true',
  });

  const handleChange = (category: string, value: string | boolean | string[], isArray = true) => {
    setFilters(prev => {
      if (!isArray) return { ...prev, [category]: value };
      
      const list = prev[category as keyof typeof prev] as string[];
      if (list.includes(value as string)) {
        return { ...prev, [category]: list.filter(v => v !== value) };
      }
      return { ...prev, [category]: [...list, value as string] };
    });
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    filters.district.forEach(v => params.append('district', v));
    filters.taluka.forEach(v => params.append('taluka', v));
    filters.village.forEach(v => params.append('village', v));
    filters.type.forEach(v => params.append('type', v));
    filters.status.forEach(v => params.append('status', v));
    
    if (filters.budget !== 'any') params.set('budget', filters.budget);
    if (filters.area !== 'any') params.set('area', filters.area);
    if (filters.featured) params.set('featured', 'true');
    if (filters.near_airport) params.set('near_airport', 'true');
    if (filters.near_nh66) params.set('near_nh66', 'true');

    const sort = searchParams.get('sort');
    if (sort) params.set('sort', sort);

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <aside className={styles.sidebar} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <div className={styles.filterGroup}>
        <h4>District</h4>
        {Object.keys(locationHierarchy).map(d => (
          <label key={d}>
            <input type="checkbox" checked={filters.district.includes(d)} onChange={() => handleChange('district', d)} /> {d}
          </label>
        ))}
      </div>

      <div className={styles.filterGroup}>
        <h4>Taluka</h4>
        {Object.values(locationHierarchy).flatMap(t => Object.keys(t)).filter((value, index, self) => self.indexOf(value) === index).map(loc => (
          <label key={loc}>
            <input type="checkbox" checked={filters.taluka.includes(loc)} onChange={() => handleChange('taluka', loc)} /> {loc}
          </label>
        ))}
      </div>
      
      <div className={styles.filterGroup}>
        <h4>Village</h4>
        {Object.values(locationHierarchy).flatMap(t => Object.values(t)).flat().filter((value, index, self) => self.indexOf(value) === index).map(v => (
          <label key={v}>
            <input type="checkbox" checked={filters.village.includes(v)} onChange={() => handleChange('village', v)} /> {v}
          </label>
        ))}
        {Object.keys(locationHierarchy).length === 0 && (
          <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Loading villages...</p>
        )}
      </div>

      <div className={styles.filterGroup}>
        <h4>Property Type</h4>
        {['Agricultural', 'Farmhouse', 'Commercial', 'Investment'].map(type => (
          <label key={type}>
            <input type="checkbox" checked={filters.type.includes(type)} onChange={() => handleChange('type', type)} /> {type}
          </label>
        ))}
      </div>

      <div className={styles.filterGroup}>
        <h4>Status</h4>
        {['Available', 'Reserved', 'Sold'].map(st => (
          <label key={st}>
            <input type="checkbox" checked={filters.status.includes(st)} onChange={() => handleChange('status', st)} /> {st}
          </label>
        ))}
      </div>

      <div className={styles.filterGroup}>
        <h4>Budget</h4>
        <select value={filters.budget} onChange={(e) => handleChange('budget', e.target.value, false)} style={{width:'100%', padding:'0.5rem', background:'var(--bg-primary)', color:'white', border: '1px solid var(--border-color)', borderRadius: '4px'}}>
          <option value="any">Any Price</option>
          <option value="under-1cr">Under ₹1 Cr</option>
          <option value="1cr-3cr">₹1 Cr - ₹3 Cr</option>
          <option value="3cr-5cr">₹3 Cr - ₹5 Cr</option>
          <option value="above-5cr">₹5 Cr +</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <h4>Area</h4>
        <select value={filters.area} onChange={(e) => handleChange('area', e.target.value, false)} style={{width:'100%', padding:'0.5rem', background:'var(--bg-primary)', color:'white', border: '1px solid var(--border-color)', borderRadius: '4px'}}>
          <option value="any">Any Area</option>
          <option value="under-1">Under 1 Acre</option>
          <option value="1-5">1 - 5 Acres</option>
          <option value="5-10">5 - 10 Acres</option>
          <option value="above-10">10+ Acres</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <h4>Highlights</h4>
        <label><input type="checkbox" checked={filters.featured} onChange={(e) => handleChange('featured', e.target.checked, false)} /> Featured Only</label>
        <label><input type="checkbox" checked={filters.near_airport} onChange={(e) => handleChange('near_airport', e.target.checked, false)} /> Near Airport</label>
        <label><input type="checkbox" checked={filters.near_nh66} onChange={(e) => handleChange('near_nh66', e.target.checked, false)} /> Near NH66</label>
      </div>
      
      <button onClick={applyFilters} className="btn-primary" style={{width: '100%', marginTop: '1rem'}}>Apply Filters</button>
    </aside>
  );
}
