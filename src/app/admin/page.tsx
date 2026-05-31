import styles from "./admin.module.css";

export default function AdminDashboard() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Dashboard Overview</h1>
        <button className="btn-primary">Generate Report</button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Properties</h3>
          <div className={styles.statValue}>124</div>
          <div className={styles.statChange + " " + styles.positive}>+12 this month</div>
        </div>
        <div className={styles.statCard}>
          <h3>Active Leads</h3>
          <div className={styles.statValue}>843</div>
          <div className={styles.statChange + " " + styles.positive}>+24% from last month</div>
        </div>
        <div className={styles.statCard}>
          <h3>Properties Sold</h3>
          <div className={styles.statValue}>45</div>
          <div className={styles.statChange + " " + styles.positive}>+5 this month</div>
        </div>
        <div className={styles.statCard}>
          <h3>Total Revenue</h3>
          <div className={styles.statValue}>₹ 120 Cr</div>
          <div className={styles.statChange + " " + styles.positive}>+15% from last year</div>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.chartCard}>
          <h3>Lead Activity</h3>
          <div className={styles.chartPlaceholder}>
            [ Lead Generation Chart ]
          </div>
        </div>
        <div className={styles.recentActivity}>
          <h3>Recent Leads</h3>
          <ul className={styles.activityList}>
            <li>
              <div className={styles.activityAvatar}>R</div>
              <div className={styles.activityDetails}>
                <h4>Rajesh Kumar</h4>
                <p>Inquiry for Luxury Farmhouse Estate</p>
                <span>2 hours ago</span>
              </div>
              <span className={styles.statusBadge}>New</span>
            </li>
            <li>
              <div className={styles.activityAvatar}>S</div>
              <div className={styles.activityDetails}>
                <h4>Sneha Patel</h4>
                <p>Requested Brochure for Dodamarg Plot</p>
                <span>5 hours ago</span>
              </div>
              <span className={styles.statusBadge}>Contacted</span>
            </li>
            <li>
              <div className={styles.activityAvatar}>A</div>
              <div className={styles.activityDetails}>
                <h4>Amit Singh</h4>
                <p>Inquiry for Mango Orchard</p>
                <span>1 day ago</span>
              </div>
              <span className={styles.statusBadge + " " + styles.hot}>Hot</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
