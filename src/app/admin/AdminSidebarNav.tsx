'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminSidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Properties', href: '/admin/properties', icon: '🏢' },
    { name: 'Leads', href: '/admin/leads', icon: '🤝' },
    { name: 'Media Library', href: '/admin/media', icon: '🖼️' },
    { name: 'Locations', href: '/admin/locations', icon: '📍' },
    { name: 'Blog Management', href: '/admin/blog', icon: '📝' },
    { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
    { name: 'Admin Users', href: '/admin/users', icon: '👥' },
    { name: 'Ask AI Consultant', href: '/admin/analytics#ai', icon: '🤖' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <nav className={styles.sidebarNav}>
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`${styles.sidebarNavItem} ${active ? styles.activeNavItem : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
