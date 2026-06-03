'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../app/properties/page.module.css';

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <select 
      className={styles.sortSelect} 
      value={searchParams.get('sort') || 'newest'}
      onChange={handleSortChange}
    >
      <option value="newest">Newest Arrivals</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
    </select>
  );
}
