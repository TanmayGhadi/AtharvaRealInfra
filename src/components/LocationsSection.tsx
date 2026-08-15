'use client';

import Link from 'next/link';
import styles from './LocationsSection.module.css';

const LOCATIONS = [
  { name: 'Dodamarg', rotation: -1.0 },
  { name: 'Sawantwadi', rotation: 0.7 },
  { name: 'Vengurla', rotation: -0.5 },
  { name: 'Kudal', rotation: 0.8 },
  { name: 'Kankavli', rotation: -0.7 },
  { name: 'Malvan', rotation: 0.5 },
  { name: 'Vaibhavwadi', rotation: -0.8 },
  { name: 'Rajapur', rotation: 0.6 },
  { name: 'Mandangad', rotation: -0.6 },
  { name: 'Shrivardhan', rotation: 0.7 },
  { name: 'Mangaon', rotation: -0.5 },
  { name: 'Roha', rotation: 0.8 },
];

interface LocationsSectionProps {
  activeLocation?: string;
  className?: string;
}

export default function LocationsSection({ activeLocation, className = '' }: LocationsSectionProps) {
  return (
    <div className={`${styles.locationsContainer} ${className}`}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.title}>More Locations We Serve</h3>
        <div className={styles.titleLine} />
      </div>

      <div className={styles.grid}>
        {LOCATIONS.map((loc) => {
          const isActive = activeLocation?.toLowerCase() === loc.name.toLowerCase();
          return (
            <Link
              key={loc.name}
              href={`/properties?taluka=${encodeURIComponent(loc.name)}`}
              className={`${styles.locationChip} ${isActive ? styles.activeChip : ''}`}
              style={{ '--hover-rotation': `${loc.rotation}deg` } as React.CSSProperties}
            >
              <span>{loc.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
