'use client';

import { useState, useEffect } from 'react';
import styles from '../app/page.module.css';

import { supabase } from '@/lib/supabase';

export default function HomeFilter() {
  const [district, setDistrict] = useState('');
  const [taluka, setTaluka] = useState('');
  const [locationHierarchy, setLocationHierarchy] = useState<Record<string, Record<string, string[]>>>({});

  useEffect(() => {
    async function fetchLocations() {
      // Fetch from new master tables
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
    <form action="/properties" method="GET" className={`${styles.searchWidget} glass-panel animate-fade-in-3`}>
      
      {/* Primary Filters (Row 1) */}
      <div className={styles.filterRow}>
        {/* District */}
        <div className={styles.searchInput}>
          <label>District</label>
          <select name="district" value={district} onChange={handleDistrictChange}>
            <option value="">All</option>
            {Object.keys(locationHierarchy).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Taluka */}
        <div className={styles.searchInput}>
          <label>Taluka</label>
          <select name="taluka" value={taluka} onChange={handleTalukaChange}>
            <option value="">All Talukas</option>
            {availableTalukas.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Village */}

        {/* Property Type */}
        <div className={styles.searchInput}>
          <label>Type</label>
          <select name="type">
            <option value="">All Types</option>
            <option value="Agricultural">Agricultural</option>
            <option value="Farmhouse">Farmhouse</option>
            <option value="Commercial">Commercial</option>
            <option value="Investment">Investment</option>
          </select>
        </div>

        {/* Status */}
        <div className={styles.searchInput}>
          <label>Status</label>
          <select name="status">
            <option value="">Any Status</option>
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
      </div>

      {/* Secondary Filters (Row 2) */}
      <div className={styles.filterRow}>
        {/* Budget */}
        <div className={styles.searchInput}>
          <label>Budget</label>
          <select name="budget">
            <option value="">Any Budget</option>
            <option value="under-1cr">Under ₹ 1 Cr</option>
            <option value="1cr-3cr">₹ 1 Cr – ₹ 3 Cr</option>
            <option value="3cr-5cr">₹ 3 Cr – ₹ 5 Cr</option>
            <option value="above-5cr">Above ₹ 5 Cr</option>
          </select>
        </div>

        {/* Area */}
        <div className={styles.searchInput}>
          <label>Area</label>
          <select name="area">
            <option value="">Any Area</option>
            <option value="under-1">Under 1 Acre</option>
            <option value="1-5">1 - 5 Acres</option>
            <option value="5-10">5 - 10 Acres</option>
            <option value="above-10">10+ Acres</option>
          </select>
        </div>

        {/* Checkboxes */}
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="featured" value="true" /> Featured
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="near_airport" value="true" /> Near Airport
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="near_nh66" value="true" /> Near NH66
          </label>
        </div>

        <button type="submit" className={`btn-primary ${styles.searchBtn}`}>
          Find Properties
        </button>
      </div>
    </form>
  );
}
