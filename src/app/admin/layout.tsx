import Image from "next/image";
import styles from "./admin.module.css";
import LogoutButton from "./LogoutButton";
import AdminSidebarNav from "./AdminSidebarNav";

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
        <AdminSidebarNav />
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
