'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import styles from '../../admin.module.css';
import { processBulkUpload } from '../bulkActions';

interface ParsedProperty {
  _rowIndex: number;
  id?: string;
  title: string;
  description: string;
  property_type: string;
  district: string;
  taluka: string;
  village: string;
  price_display: string;
  price_numeric: number;
  area_display: string;
  area_sqm: number;
  status: string;
  is_featured: boolean | string;
  latitude?: string | number | null;
  longitude?: string | number | null;
  cover_image_url?: string;
  gallery_urls?: string;
  video_urls?: string;
  
  // Validation tracking
  isValid: boolean;
  errors: string[];
  missingOptional: string[];
}

export default function BulkPropertyImportPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  
  // Step 2 State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [fileWorkbook, setFileWorkbook] = useState<XLSX.WorkBook | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Step 3 State
  const [parsedRows, setParsedRows] = useState<ParsedProperty[]>([]);
  const [filterTab, setFilterTab] = useState<'all' | 'ready' | 'error'>('all');

  // Step 4 & 5 State
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStats, setImportStats] = useState({
    processed: 0,
    success: 0,
    failed: 0,
    total: 0,
    errors: [] as { row: number; title: string; error: string }[]
  });

  // Helpers for Price and Area auto-derivation
  const derivePriceNumeric = (priceDisplay: string, priceNumeric?: any): number => {
    if (priceNumeric !== undefined && priceNumeric !== null && priceNumeric !== '' && !isNaN(Number(priceNumeric)) && Number(priceNumeric) > 0) {
      return Number(priceNumeric);
    }
    if (!priceDisplay) return 0;
    const numMatch = priceDisplay.replace(/,/g, '').match(/[\d.]+/);
    if (!numMatch) return 0;
    let val = parseFloat(numMatch[0]);
    const lower = priceDisplay.toLowerCase();
    if (lower.includes('cr')) val *= 10000000;
    else if (lower.includes('lakh') || lower.includes('lac')) val *= 100000;
    else if (lower.includes('k') || lower.includes('thousand')) val *= 1000;
    return val;
  };

  const deriveAreaSqm = (areaDisplay: string, areaSqm?: any): number => {
    if (areaSqm !== undefined && areaSqm !== null && areaSqm !== '' && !isNaN(Number(areaSqm)) && Number(areaSqm) > 0) {
      return Number(areaSqm);
    }
    if (!areaDisplay) return 0;
    const numMatch = areaDisplay.replace(/,/g, '').match(/[\d.]+/);
    if (!numMatch) return 0;
    let num = parseFloat(numMatch[0]);
    const lower = areaDisplay.toLowerCase();
    if (lower.includes('guntha')) return Number((num * 101.171).toFixed(2));
    else if (lower.includes('acre')) return Number((num * 4046.86).toFixed(2));
    else if (lower.includes('hectare') || lower.includes('ha')) return Number((num * 10000).toFixed(2));
    else if (lower.includes('sqft') || lower.includes('sq ft')) return Number((num * 0.092903).toFixed(2));
    else if (lower.includes('sqm') || lower.includes('sq meter')) return num;
    return num;
  };

  // Step 2 File Selection Handler
  const handleFileChange = (file: File) => {
    if (!file) return;
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        setFileWorkbook(wb);
        setSheetNames(wb.SheetNames);
        
        // Auto select 'Properties' sheet if available, else first sheet
        const defaultSheet = wb.SheetNames.includes('Properties') ? 'Properties' : wb.SheetNames[0];
        setSelectedSheet(defaultSheet);
      } catch (err) {
        alert('Could not parse Excel file format. Please ensure it is a valid .xlsx file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Auto-detect header row and parse property objects
  const handleParseAndValidate = () => {
    if (!fileWorkbook || !selectedSheet) return;

    const sheet = fileWorkbook.Sheets[selectedSheet];
    if (!sheet) return;

    const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    if (rawRows.length === 0) {
      alert('The selected sheet is empty.');
      return;
    }

    // Find header row index
    let headerIdx = 0;
    for (let i = 0; i < Math.min(20, rawRows.length); i++) {
      const r = rawRows[i];
      if (Array.isArray(r)) {
        const rStr = r.join(' ').toLowerCase();
        if (rStr.includes('title') && (rStr.includes('district') || rStr.includes('price'))) {
          headerIdx = i;
          break;
        }
      }
    }

    const headers = rawRows[headerIdx].map((h: any) => String(h || '').trim());
    const parsedList: ParsedProperty[] = [];

    for (let i = headerIdx + 1; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!row || !Array.isArray(row) || row.length === 0) continue;

      const hasData = row.some(cell => cell !== undefined && cell !== null && String(cell).trim() !== '');
      if (!hasData) continue;

      const obj: any = { _rowIndex: i + 1 };
      headers.forEach((h, colIdx) => {
        const cleanHeader = h.replace(/\*/g, '').trim().toLowerCase();
        let key = cleanHeader;
        if (cleanHeader.includes('title')) key = 'title';
        else if (cleanHeader.includes('description')) key = 'description';
        else if (cleanHeader.includes('property type')) key = 'property_type';
        else if (cleanHeader.includes('district')) key = 'district';
        else if (cleanHeader.includes('taluka')) key = 'taluka';
        else if (cleanHeader.includes('village')) key = 'village';
        else if (cleanHeader.includes('price display') || cleanHeader === 'price (display)') key = 'price_display';
        else if (cleanHeader.includes('price numeric') || cleanHeader === 'price (numeric)') key = 'price_numeric';
        else if (cleanHeader.includes('area display') || cleanHeader === 'area (display)') key = 'area_display';
        else if (cleanHeader.includes('area (sqm)') || cleanHeader.includes('area sqm')) key = 'area_sqm';
        else if (cleanHeader.includes('status')) key = 'status';
        else if (cleanHeader.includes('featured')) key = 'is_featured';
        else if (cleanHeader.includes('latitude')) key = 'latitude';
        else if (cleanHeader.includes('longitude')) key = 'longitude';
        else if (cleanHeader.includes('cover image')) key = 'cover_image_url';
        else if (cleanHeader.includes('gallery')) key = 'gallery_urls';
        else if (cleanHeader.includes('video')) key = 'video_urls';
        else if (cleanHeader === 'id') key = 'id';

        const cellValue = row[colIdx];
        obj[key] = cellValue !== undefined && cellValue !== null ? String(cellValue).trim() : '';
      });

      // Derive Price & Area if missing or unparsed
      const derivedPrice = derivePriceNumeric(obj.price_display, obj.price_numeric);
      const derivedArea = deriveAreaSqm(obj.area_display, obj.area_sqm);

      const errors: string[] = [];
      const missingOptional: string[] = [];

      // Required fields validation
      if (!obj.title) errors.push('Title is required');
      if (!obj.district) errors.push('District is required');
      if (!obj.taluka) errors.push('Taluka is required');
      if (!obj.price_display) errors.push('Price Display is required');
      if (!derivedPrice || isNaN(derivedPrice)) errors.push('Price Numeric is invalid or missing');
      if (!obj.area_display) errors.push('Area Display is required');

      // Optional fields tracking
      if (!obj.cover_image_url) missingOptional.push('Cover Image URL');
      if (!obj.gallery_urls) missingOptional.push('Gallery URLs');
      if (!obj.video_urls) missingOptional.push('Video URLs');
      if (!obj.latitude || !obj.longitude) missingOptional.push('Map Coordinates');

      const parsedProp: ParsedProperty = {
        _rowIndex: i + 1,
        id: obj.id,
        title: obj.title || 'Untitled Property',
        description: obj.description || '',
        property_type: obj.property_type || 'Agricultural Land',
        district: obj.district || '',
        taluka: obj.taluka || '',
        village: obj.village || '',
        price_display: obj.price_display || '',
        price_numeric: derivedPrice,
        area_display: obj.area_display || '',
        area_sqm: derivedArea,
        status: obj.status || 'Available',
        is_featured: obj.is_featured || 'No',
        latitude: obj.latitude,
        longitude: obj.longitude,
        cover_image_url: obj.cover_image_url,
        gallery_urls: obj.gallery_urls,
        video_urls: obj.video_urls,
        isValid: errors.length === 0,
        errors,
        missingOptional
      };

      parsedList.push(parsedProp);
    }

    setParsedRows(parsedList);
    setCurrentStep(3);
  };

  // Step 3 Validation Metrics
  const totalCount = parsedRows.length;
  const readyRows = parsedRows.filter(r => r.isValid);
  const errorRows = parsedRows.filter(r => !r.isValid);
  const missingOptCount = parsedRows.filter(r => r.missingOptional.length > 0).length;

  // Filtered rows for table view
  const displayedRows = filterTab === 'ready' ? readyRows : filterTab === 'error' ? errorRows : parsedRows;

  // Download Error Report
  const handleDownloadErrorReport = () => {
    if (errorRows.length === 0) {
      alert('No errors found in parsed data!');
      return;
    }

    let reportText = `ATHARVA REAL INFRA — BULK IMPORT ERROR REPORT\n`;
    reportText += `Generated: ${new Date().toLocaleString()}\n`;
    reportText += `Total Rows: ${totalCount} | Invalid Rows: ${errorRows.length}\n\n`;
    reportText += `--------------------------------------------------------\n\n`;

    errorRows.forEach(row => {
      reportText += `ROW ${row._rowIndex}: "${row.title}"\n`;
      reportText += `Errors:\n`;
      row.errors.forEach(e => reportText += `  - ${e}\n`);
      reportText += `\n`;
    });

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bulk_Import_Errors_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Step 4 Execution — Partial & Full Import Process
  const handleStartImport = async () => {
    if (readyRows.length === 0) {
      alert('There are no valid property rows ready to import.');
      return;
    }

    setCurrentStep(4);
    setIsImporting(true);
    setImportProgress(0);

    const totalToImport = readyRows.length;
    setImportStats({
      processed: 0,
      success: 0,
      failed: 0,
      total: totalToImport,
      errors: []
    });

    // Chunk array in batches of 10 for smooth real-time progress updates
    const batchSize = 10;
    let successAccumulator = 0;
    let failedAccumulator = 0;
    const accumulatedErrors: { row: number; title: string; error: string }[] = [];

    for (let i = 0; i < totalToImport; i += batchSize) {
      const chunk = readyRows.slice(i, i + batchSize);
      const res = await processBulkUpload(chunk);

      successAccumulator += res.success;
      failedAccumulator += res.failed;
      if (res.errors && res.errors.length > 0) {
        accumulatedErrors.push(...res.errors);
      }

      const processedSoFar = Math.min(i + batchSize, totalToImport);
      const progressPercent = Math.round((processedSoFar / totalToImport) * 100);

      setImportProgress(progressPercent);
      setImportStats({
        processed: processedSoFar,
        success: successAccumulator,
        failed: failedAccumulator,
        total: totalToImport,
        errors: accumulatedErrors
      });
    }

    setIsImporting(false);
    setCurrentStep(5);
  };

  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <div>
          <h1>Bulk Property Import</h1>
          <p style={{ marginTop: '0.4rem', color: '#3D4A41', fontSize: '0.95rem', fontWeight: 500 }}>
            Professional 5-step property data onboarding system.
          </p>
        </div>
        <Link 
          href="/admin/properties" 
          className="btn-outline" 
          style={{ padding: '8px 16px', fontSize: '0.85rem', borderColor: '#123128', color: '#123128', fontWeight: 700 }}
        >
          Back to Properties
        </Link>
      </div>

      {/* Stepper Navigation */}
      <div className={styles.stepperContainer}>
        {[
          { num: 1, title: 'Requirements' },
          { num: 2, title: 'Upload' },
          { num: 3, title: 'Review & Validate' },
          { num: 4, title: 'Importing' },
          { num: 5, title: 'Complete' }
        ].map((step, idx) => {
          const isActive = currentStep === step.num;
          const isDone = currentStep > step.num;
          return (
            <div key={step.num} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div className={`${styles.stepItem} ${isActive ? styles.stepActive : isDone ? styles.stepComplete : ''}`}>
                <div className={styles.stepNumber}>
                  {isDone ? '✓' : step.num}
                </div>
                <span className={styles.stepTitle}>{step.title}</span>
              </div>
              {idx < 4 && <div className={styles.stepDivider} />}
            </div>
          );
        })}
      </div>

      {/* STEP 1: REQUIREMENTS & SAMPLE DOWNLOAD */}
      {currentStep === 1 && (
        <div className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(18,49,40,0.15)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ color: '#123128', fontFamily: 'var(--font-serif)', fontSize: '1.4rem', margin: 0 }}>
                Step 1: Spreadsheet Template & Requirements
              </h2>
              <p style={{ color: '#5D665F', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Please review mandatory and optional data columns before uploading.
              </p>
            </div>
            <a 
              href="/Bulk properties.xlsx" 
              download="Bulk properties.xlsx"
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.85rem', fontWeight: 700, backgroundColor: '#123128', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              📥 Download Official Excel Template
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#EDE7DA', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(18,49,40,0.15)' }}>
              <h3 style={{ color: '#123128', fontSize: '1rem', marginTop: 0, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#991B1B' }}>*</span> Mandatory Requirements
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#17231F', fontSize: '0.88rem', lineHeight: '1.65' }}>
                <li><strong>Title:</strong> Property name (e.g. Riverside Farmhouse Plot)</li>
                <li><strong>Description:</strong> Full listing details and features</li>
                <li><strong>Property Type:</strong> Agricultural, Farmhouse, Commercial, or Investment</li>
                <li><strong>District, Taluka, Village:</strong> Location hierarchy details</li>
                <li><strong>Price (Display & Numeric):</strong> e.g. ₹ 50 Lakh (5000000)</li>
                <li><strong>Area (Display & sqm):</strong> e.g. 1 Acre (4046.86 sqm)</li>
                <li><strong>Status:</strong> Available, Sold, Reserved, or On Hold</li>
              </ul>
            </div>

            <div style={{ background: '#EDE7DA', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(18,49,40,0.15)' }}>
              <h3 style={{ color: '#123128', fontSize: '1rem', marginTop: 0, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#166534' }}>✓</span> Optional Data Fields
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#17231F', fontSize: '0.88rem', lineHeight: '1.65' }}>
                <li><strong>Cover Image URL:</strong> Direct image URL link</li>
                <li><strong>Gallery URLs:</strong> Comma-separated image links</li>
                <li><strong>Video URLs:</strong> Comma-separated video links</li>
                <li><strong>Coordinates:</strong> Latitude & Longitude decimal values</li>
                <li><strong>Featured Status:</strong> Yes or No</li>
              </ul>
            </div>
          </div>

          <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', padding: '1rem 1.25rem', borderRadius: '8px', color: '#166534', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.5', fontWeight: 600 }}>
            💡 <strong>Pro Tip:</strong> Missing cover images, gallery photos, videos, or map coordinates will <u>NOT</u> cause row validation errors. Media and coordinates can be uploaded or edited anytime later via Property Management.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => setCurrentStep(2)}
              className="btn-primary"
              style={{ padding: '12px 32px', fontSize: '1rem', fontWeight: 700, backgroundColor: '#123128', color: '#FFFFFF' }}
            >
              Continue to File Upload →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: FILE UPLOAD & SHEET SELECTOR */}
      {currentStep === 2 && (
        <div className={styles.card}>
          <h2 style={{ color: '#123128', fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginTop: 0, marginBottom: '1.5rem' }}>
            Step 2: Upload Property Spreadsheet
          </h2>

          <div 
            className={styles.dropzone}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileChange(e.dataTransfer.files[0]);
              }
            }}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              accept=".xlsx, .xls" 
              style={{ display: 'none' }} 
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            />
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
            <h3 style={{ color: '#123128', margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
              {selectedFile ? selectedFile.name : 'Click or Drag & Drop Excel File Here'}
            </h3>
            <p style={{ color: '#5D665F', margin: 0, fontSize: '0.9rem' }}>
              {selectedFile ? `File Size: ${(selectedFile.size / 1024).toFixed(1)} KB` : 'Supports official template (.xlsx, .xls)'}
            </p>
          </div>

          {sheetNames.length > 0 && (
            <div style={{ marginTop: '1.5rem', background: '#EDE7DA', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(18,49,40,0.15)' }}>
              <label style={{ display: 'block', color: '#123128', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Select Sheet to Import:
              </label>
              <select 
                value={selectedSheet} 
                onChange={(e) => setSelectedSheet(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', background: '#FFFFFF', border: '1px solid rgba(18,49,40,0.25)', color: '#17231F', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 600 }}
              >
                {sheetNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              onClick={() => setCurrentStep(1)} 
              className="btn-outline" 
              style={{ padding: '10px 24px', borderColor: '#123128', color: '#123128', fontWeight: 700 }}
            >
              ← Back to Requirements
            </button>
            <button 
              onClick={handleParseAndValidate} 
              disabled={!selectedFile || !selectedSheet}
              className="btn-primary"
              style={{ 
                padding: '12px 32px', 
                fontSize: '1rem', 
                fontWeight: 700, 
                backgroundColor: selectedFile ? '#123128' : '#A0AEC0', 
                color: '#FFFFFF',
                cursor: selectedFile ? 'pointer' : 'not-allowed'
              }}
            >
              Parse & Validate File →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & VALIDATION */}
      {currentStep === 3 && (
        <div>
          {/* Validation Metrics Summary */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📋</div>
              <div className={styles.statContent}>
                <h3>Total Parsed</h3>
                <div className={styles.statValue}>{totalCount}</div>
                <div style={{ fontSize: '0.78rem', color: '#5D665F', fontWeight: 600 }}>Spreadsheet Rows</div>
              </div>
            </div>

            <div className={styles.statCard} style={{ background: '#DCFCE7', borderColor: '#86EFAC' }}>
              <div className={styles.statIcon} style={{ background: '#166534', color: '#FFFFFF' }}>✓</div>
              <div className={styles.statContent}>
                <h3 style={{ color: '#166534' }}>Ready to Upload</h3>
                <div className={styles.statValue} style={{ color: '#166534' }}>{readyRows.length}</div>
                <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700 }}>Valid Records</div>
              </div>
            </div>

            <div className={styles.statCard} style={{ background: errorRows.length > 0 ? '#FEE2E2' : '#EDE7DA', borderColor: errorRows.length > 0 ? '#FCA5A5' : 'rgba(18,49,40,0.15)' }}>
              <div className={styles.statIcon} style={{ background: errorRows.length > 0 ? '#991B1B' : '#123128', color: '#FFFFFF' }}>⚠️</div>
              <div className={styles.statContent}>
                <h3 style={{ color: errorRows.length > 0 ? '#991B1B' : '#4A5568' }}>Needs Attention</h3>
                <div className={styles.statValue} style={{ color: errorRows.length > 0 ? '#991B1B' : '#123128' }}>{errorRows.length}</div>
                <div style={{ fontSize: '0.78rem', color: errorRows.length > 0 ? '#991B1B' : '#5D665F', fontWeight: 700 }}>Validation Errors</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>📷</div>
              <div className={styles.statContent}>
                <h3>Optional Missing</h3>
                <div className={styles.statValue}>{missingOptCount}</div>
                <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700 }}>Can Edit Later</div>
              </div>
            </div>
          </div>

          <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', background: '#EDE7DA', borderBottom: '1px solid rgba(18,49,40,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setFilterTab('all')}
                  style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid rgba(18,49,40,0.2)', background: filterTab === 'all' ? '#123128' : '#FFFFFF', color: filterTab === 'all' ? '#FFFFFF' : '#123128', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  All ({totalCount})
                </button>
                <button 
                  onClick={() => setFilterTab('ready')}
                  style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #86EFAC', background: filterTab === 'ready' ? '#166534' : '#DCFCE7', color: filterTab === 'ready' ? '#FFFFFF' : '#166534', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Ready ({readyRows.length})
                </button>
                <button 
                  onClick={() => setFilterTab('error')}
                  style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #FCA5A5', background: filterTab === 'error' ? '#991B1B' : '#FEE2E2', color: filterTab === 'error' ? '#FFFFFF' : '#991B1B', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Errors ({errorRows.length})
                </button>
              </div>

              {errorRows.length > 0 && (
                <button 
                  onClick={handleDownloadErrorReport}
                  className="btn-outline"
                  style={{ padding: '6px 14px', borderColor: '#991B1B', color: '#991B1B', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  📄 Download Error Report
                </button>
              )}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(18,49,40,0.15)', background: '#F5F1E8' }}>
                    <th style={{ padding: '0.85rem 1rem', color: '#123128', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase' }}>Row</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#123128', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase' }}>Validation Status</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#123128', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase' }}>Title</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#123128', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase' }}>Location</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#123128', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase' }}>Price</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#123128', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase' }}>Area</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#123128', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase' }}>Issue Details</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRows.map((row) => (
                    <tr key={row._rowIndex} style={{ borderBottom: '1px solid rgba(18,49,40,0.08)', background: row.isValid ? '#FFFFFF' : '#FFF5F5' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#123128' }}>{row._rowIndex}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {row.isValid ? (
                          <span style={{ background: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                            ✓ READY
                          </span>
                        ) : (
                          <span style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                            ⚠️ ERROR
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#17231F', maxWidth: '220px' }}>{row.title}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#3D4A41', fontSize: '0.88rem' }}>{row.village ? `${row.village}, ` : ''}{row.taluka}, {row.district}</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#123128', fontSize: '0.9rem' }}>{row.price_display}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#3D4A41', fontSize: '0.88rem' }}>{row.area_display}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {row.isValid ? (
                          row.missingOptional.length > 0 ? (
                            <span style={{ color: '#5D665F', fontSize: '0.78rem' }}>No media provided (optional)</span>
                          ) : (
                            <span style={{ color: '#166534', fontSize: '0.78rem', fontWeight: 700 }}>All fields complete</span>
                          )
                        ) : (
                          <div style={{ color: '#991B1B', fontSize: '0.78rem', fontWeight: 600 }}>
                            {row.errors.join(' • ')}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '1.5rem', background: '#F5F1E8', borderTop: '1px solid rgba(18,49,40,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                onClick={() => setCurrentStep(2)} 
                className="btn-outline" 
                style={{ padding: '10px 24px', borderColor: '#123128', color: '#123128', fontWeight: 700 }}
              >
                ← Re-upload Spreadsheet
              </button>

              <button 
                onClick={handleStartImport}
                disabled={readyRows.length === 0}
                className="btn-primary"
                style={{ 
                  padding: '12px 32px', 
                  fontSize: '1rem', 
                  fontWeight: 700, 
                  backgroundColor: readyRows.length > 0 ? '#123128' : '#A0AEC0', 
                  color: '#FFFFFF' 
                }}
              >
                {errorRows.length > 0 ? `Partial Import: Upload ${readyRows.length} Valid Properties →` : `Upload All ${readyRows.length} Properties →`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: IMPORTING IN PROGRESS */}
      {currentStep === 4 && (
        <div className={styles.card} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>⏳</div>
          <h2 style={{ color: '#123128', fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
            Importing Property Listings...
          </h2>
          <p style={{ color: '#5D665F', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Please wait while your listings are validated and saved to the database.
          </p>

          <div style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            <div style={{ height: '14px', background: '#EDE7DA', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(18,49,40,0.2)' }}>
              <div style={{ height: '100%', width: `${importProgress}%`, background: '#123128', transition: 'width 0.3s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.85rem', fontWeight: 700, color: '#123128' }}>
              <span>Progress: {importProgress}%</span>
              <span>{importStats.processed} of {importStats.total} Processed</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
            <div style={{ background: '#DCFCE7', padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid #86EFAC', color: '#166534', fontWeight: 700 }}>
              Successful: {importStats.success}
            </div>
            <div style={{ background: '#FEE2E2', padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid #FCA5A5', color: '#991B1B', fontWeight: 700 }}>
              Failed: {importStats.failed}
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: IMPORT COMPLETE */}
      {currentStep === 5 && (
        <div className={styles.card} style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div style={{ width: '80px', height: '80px', background: '#DCFCE7', border: '2px solid #86EFAC', borderRadius: '50%', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem auto' }}>
            ✓
          </div>
          <h2 style={{ color: '#123128', fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
            Bulk Import Completed Successfully!
          </h2>
          <p style={{ color: '#5D665F', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
            All valid properties have been saved to your database. Any missing cover photos, gallery images, videos, or map coordinates can be updated anytime via Property Management.
          </p>

          <div style={{ maxWidth: '500px', margin: '0 auto 2.5rem auto', background: '#EDE7DA', padding: '1.5rem', borderRadius: '10px', border: '1px solid rgba(18,49,40,0.15)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <div style={{ color: '#5D665F', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>Total</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#123128' }}>{importStats.total}</div>
            </div>
            <div>
              <div style={{ color: '#166534', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>Uploaded</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#166534' }}>{importStats.success}</div>
            </div>
            <div>
              <div style={{ color: '#991B1B', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>Failed</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#991B1B' }}>{importStats.failed}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link 
              href="/admin/properties" 
              className="btn-primary" 
              style={{ padding: '12px 28px', backgroundColor: '#123128', color: '#FFFFFF', fontWeight: 700, textDecoration: 'none' }}
            >
              View Uploaded Properties
            </Link>
            <button 
              onClick={() => {
                setSelectedFile(null);
                setSheetNames([]);
                setParsedRows([]);
                setCurrentStep(1);
              }} 
              className="btn-outline" 
              style={{ padding: '12px 28px', borderColor: '#123128', color: '#123128', fontWeight: 700 }}
            >
              Upload Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
