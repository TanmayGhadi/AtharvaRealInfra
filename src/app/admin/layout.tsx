import Link from "next/link";
import Image from "next/image";
import styles from "./admin.module.css";
import LogoutButton from "./LogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.adminLayout}>
      {/* Admin Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Image src="/logo.jpg" alt="Atharva Admin Logo" width={40} height={40} style={{ objectFit: 'cover', borderRadius: '50%', border: '1px solid var(--accent-gold)' }} />
          <h2 style={{ marginLeft: '10px', fontSize: '1.2rem' }}>Atharva Admin</h2>
        </div>
        <nav className={styles.sidebarNav}>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/properties">Properties</Link>
          <Link href="/admin/leads">Leads</Link>
          <Link href="/admin/media">Media Library</Link>
          <Link href="/admin/locations">Locations</Link>
          <Link href="/admin/blog">Blog Management</Link>
          <Link href="/admin/analytics">Analytics</Link>
          <Link href="/admin/settings">Settings</Link>
          <Link href="/admin/users">Admin Users</Link>
        </nav>
        <div className={styles.sidebarFooter}>
          <LogoutButton />
        </div>
      </aside>

      {/* Admin Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.search}>
            <input type="text" placeholder="Search..." />
          </div>
          <div className={styles.userProfile}>
            <span>Admin User</span>
            <div className={styles.avatar}>A</div>
          </div>
        </header>
        <div className={styles.contentArea}>
          {children}
        </div>
      </main>
    </div>
  );
}
