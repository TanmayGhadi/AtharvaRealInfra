'use client';

import { useState, useEffect } from 'react';
import styles from './HomeFilter.module.css';
import { supabase } from '@/lib/supabase';

export default function HomeFilter() {
  const [district, setDistrict] = useState('');
  const [taluka, setTaluka] = useState('');
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

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistrict(e.target.value);
    setTaluka('');
  };

  const handleTalukaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTaluka(e.target.value);
  };

  const allTalukas = Array.from(new Set(Object.values(locationHierarchy).flatMap(d => Object.keys(d))));
  const availableTalukas = district 
    ? Object.keys(locationHierarchy[district] || {}) 
    : allTalukas;

  return (
    <form action="/properties" method="GET" className={styles.searchPanel}>
      <div className={styles.filterGrid}>
        {/* District */}
        <div className={styles.fieldGroup}>
          <label>Location / District</label>
          <select name="district" value={district} onChange={handleDistrictChange} className={styles.selectInput}>
            <option value="">All Locations</option>
            {Object.keys(locationHierarchy).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Taluka */}
        <div className={styles.fieldGroup}>
          <label>Taluka</label>
          <select name="taluka" value={taluka} onChange={handleTalukaChange} className={styles.selectInput}>
            <option value="">All Talukas</option>
            {availableTalukas.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div className={styles.fieldGroup}>
          <label>Property Type</label>
          <select name="type" className={styles.selectInput}>
            <option value="">All Types</option>
            <option value="Agricultural">Agricultural Land</option>
            <option value="Farmhouse">Farmhouse Plot</option>
            <option value="Commercial">Commercial Plot</option>
            <option value="Investment">Investment Land</option>
          </select>
        </div>

        {/* Budget */}
        <div className={styles.fieldGroup}>
          <label>Budget</label>
          <select name="budget" className={styles.selectInput}>
            <option value="">Any Budget</option>
            <option value="under-1cr">Under ₹ 1 Cr</option>
            <option value="1cr-3cr">₹ 1 Cr – ₹ 3 Cr</option>
            <option value="3cr-5cr">₹ 3 Cr – ₹ 5 Cr</option>
            <option value="above-5cr">Above ₹ 5 Cr</option>
          </select>
        </div>

        {/* Search Submit Button */}
        <button type="submit" className={styles.searchBtn}>
          SEARCH PROPERTIES
        </button>
      </div>

      <div className={styles.secondaryRow}>
        <div className={styles.checkboxes}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="featured" value="true" /> Featured Only
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="near_airport" value="true" /> Near Mopa Airport
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="near_nh66" value="true" /> Near NH-66 Highway
          </label>
        </div>
      </div>
    </form>
  );
}
