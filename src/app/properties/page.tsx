import Link from "next/link";
import styles from "./page.module.css";
import { getServiceSupabase } from "@/lib/supabase";
import PropertyFilters from "@/components/PropertyFilters";
import SortSelect from "@/components/SortSelect";
import PropertyCard from "@/components/PropertyCard";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property Listings | Agricultural Land & NA Plots in Sindhudurg",
  description: "Browse curated land investment listings. Find agricultural plots, farmhouses, and NA land opportunities near Mopa Airport, Goa, and NH-66.",
  alternates: { canonical: 'https://www.atharvarealinfra.com/properties' }
};

export const revalidate = 0;

export default async function Properties({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const supabase = getServiceSupabase();
  let query = supabase.from('properties').select('*');

  // Filters
  if (resolvedSearchParams.district && resolvedSearchParams.district !== '') {
    const districts = Array.isArray(resolvedSearchParams.district) ? resolvedSearchParams.district : [resolvedSearchParams.district];
    const orQuery = districts.filter(Boolean).map(d => `district.ilike.%${d.trim()}%`).join(',');
    if (orQuery) query = query.or(orQuery);
  }
  if (resolvedSearchParams.taluka && resolvedSearchParams.taluka !== '') {
    const talukas = Array.isArray(resolvedSearchParams.taluka) ? resolvedSearchParams.taluka : [resolvedSearchParams.taluka];
    const orQuery = talukas.filter(Boolean).map(t => `taluka.ilike.%${t.trim()}%`).join(',');
    if (orQuery) query = query.or(orQuery);
  }
  if (resolvedSearchParams.village && resolvedSearchParams.village !== '') {
    const villages = Array.isArray(resolvedSearchParams.village) ? resolvedSearchParams.village : [resolvedSearchParams.village];
    const orQuery = villages.filter(Boolean).map(v => `village.ilike.%${v.trim()}%`).join(',');
    if (orQuery) query = query.or(orQuery);
  }
  if (resolvedSearchParams.type) {
    const types = Array.isArray(resolvedSearchParams.type) ? resolvedSearchParams.type : [resolvedSearchParams.type];
    query = query.in('property_type', types);
  }
  if (resolvedSearchParams.status && resolvedSearchParams.status !== '') {
    const statuses = Array.isArray(resolvedSearchParams.status) ? resolvedSearchParams.status : [resolvedSearchParams.status];
    query = query.in('status', statuses);
  } else if (!resolvedSearchParams.status && resolvedSearchParams.status !== '') {
    query = query.eq('status', 'Available');
  }

  if (resolvedSearchParams.featured === 'true') query = query.eq('is_featured', true);
  if (resolvedSearchParams.near_airport === 'true') query = query.eq('near_airport', true);
  if (resolvedSearchParams.near_nh66 === 'true') query = query.eq('near_highway', true);

  // Budget filter
  if (resolvedSearchParams.budget) {
    const b = resolvedSearchParams.budget;
    if (b === 'under-1cr') query = query.lt('price_numeric', 10000000);
    else if (b === '1cr-3cr') query = query.gte('price_numeric', 10000000).lte('price_numeric', 30000000);
    else if (b === '3cr-5cr') query = query.gte('price_numeric', 30000000).lte('price_numeric', 50000000);
    else if (b === 'above-5cr') query = query.gt('price_numeric', 50000000);
  }

  // Area filter
  if (resolvedSearchParams.area) {
    const a = resolvedSearchParams.area;
    if (a === 'under-1') query = query.lt('area_sqm', 4047);
    else if (a === '1-5') query = query.gte('area_sqm', 4047).lte('area_sqm', 20235);
    else if (a === '5-10') query = query.gte('area_sqm', 20235).lte('area_sqm', 40469);
    else if (a === 'above-10') query = query.gt('area_sqm', 40469);
  }

  // Sorting
  const sort = resolvedSearchParams.sort || 'newest';
  if (sort === 'price-low') query = query.order('price_numeric', { ascending: true });
  else if (sort === 'price-high') query = query.order('price_numeric', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  const { data: properties, error } = await query;
  if (error) console.error("Error fetching properties:", error);
  const displayProperties = properties || [];

  return (
    <div className={styles.propertiesPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <span className={styles.headerSubtitle}>PROPERTIES</span>
          <h1>Find Land Worth Investing In</h1>
          <p>Explore curated agricultural and real estate opportunities in Sindhudurg & Konkan.</p>
        </div>
      </div>

      <div className={`section-container ${styles.layout}`}>
        {/* Sidebar Filters */}
        <Suspense fallback={<aside className={styles.sidebar}>Loading filters...</aside>}>
          <PropertyFilters />
        </Suspense>

        {/* Property Grid */}
        <div className={styles.mainContent}>
          <div className={styles.toolbar}>
            <p className={styles.resultsCount}>Showing {displayProperties.length} properties</p>
            <Suspense fallback={<div>Loading...</div>}>
              <SortSelect />
            </Suspense>
          </div>

          <div className="grid-3">
            {displayProperties.map((prop: any, idx: number) => (
              <PropertyCard key={prop.id} prop={prop} index={idx} styleClass="" />
            ))}
          </div>

          {displayProperties.length === 0 && (
            <div style={{ 
              backgroundColor: 'var(--soft-cream, #EDE7DA)', 
              borderRadius: '8px', 
              padding: '4rem 2rem', 
              textAlign: 'center', 
              border: '1px solid rgba(18, 49, 40, 0.12)',
              marginTop: '1rem'
            }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-forest)' }}>
                No Properties Found
              </h3>
              <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
                Try adjusting your filters or exploring another location.
              </p>
              <Link href="/properties" className="btn-primary">
                RESET FILTERS
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
