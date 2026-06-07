'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { processBulkUpload } from '../bulkActions';
import styles from '../../admin.module.css';
import Link from 'next/link';

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    setUploading(true);
    setResults(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        
        if (jsonData.length === 0) {
          throw new Error("No data found in the file.");
        }

        // Send to server action
        const uploadResults = await processBulkUpload(jsonData);
        setResults(uploadResults);
      } catch (err: any) {
        console.error(err);
        setResults({
          success: 0,
          failed: 1,
          errors: [err.message || 'Error parsing the file. Please ensure it is a valid Excel or CSV file.']
        });
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => {
      setResults({ success: 0, failed: 1, errors: ['Failed to read the file.'] });
      setUploading(false);
    };
    
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const headers = [
      'id', 'title', 'description', 'property_type', 'district', 'taluka', 'village', 
      'price_display', 'price_numeric', 'area_display', 'area_sqm', 'status', 'is_featured', 
      'latitude', 'longitude', 'cover_image_url', 'gallery_urls', 'video_urls'
    ];
    
    const sampleData = [
      ['', 'Sample Farmhouse', 'A beautiful plot', 'Farmhouse', 'Sindhudurg', 'Kudal', 'Pinguli', '₹ 50 Lakh', '5000000', '1 Acre', '4046.86', 'Available', 'Yes', '16.0', '73.5', 'https://...', 'https://..., https://...', '']
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Properties");
    
    XLSX.writeFile(wb, "Atharva_Properties_Template.xlsx");
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Bulk Import Properties</h1>
        <Link href="/admin/properties" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          Back to Properties
        </Link>
      </div>

      <div className={styles.card} style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>1. Download Template</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Download the Excel template to see the required format. The <strong style={{color: 'white'}}>'id'</strong> column should be left empty for new properties. 
          If you want to update existing properties, include their IDs.
        </p>
        <button onClick={downloadTemplate} className="btn-outline">
          ⬇️ Download Excel Template
        </button>
      </div>

      <div className={styles.card}>
        <h2 style={{ marginBottom: '1rem' }}>2. Upload Properties Data</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Upload your filled Excel (.xlsx) or CSV file containing 50-500 properties. 
          The system will automatically map locations, images, and prices.
        </p>
        
        <div style={{ padding: '2rem', border: '2px dashed rgba(212,175,55,0.3)', borderRadius: '8px', textAlign: 'center', marginBottom: '1.5rem' }}>
          <input 
            type="file" 
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
            onChange={handleFileChange}
            disabled={uploading}
            style={{ marginBottom: '1rem', color: 'white' }}
          />
          {file && <div style={{ color: 'var(--accent-gold)' }}>Selected file: {file.name}</div>}
        </div>

        <button 
          onClick={handleUpload} 
          className="btn-primary" 
          disabled={!file || uploading}
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        >
          {uploading ? 'Processing Data...' : 'Start Bulk Import'}
        </button>

        {results && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Import Results</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(74, 222, 128, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px solid #4ade80' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ade80' }}>{results.success}</div>
                <div style={{ color: '#4ade80' }}>Successfully Saved</div>
              </div>
              <div style={{ background: 'rgba(248, 113, 113, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px solid #f87171' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f87171' }}>{results.failed}</div>
                <div style={{ color: '#f87171' }}>Failed</div>
              </div>
            </div>

            {results.errors.length > 0 && (
              <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid #f87171' }}>
                <h4 style={{ color: '#f87171', marginBottom: '0.5rem' }}>Error Details:</h4>
                <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', margin: 0 }}>
                  {results.errors.map((err, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem' }}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
