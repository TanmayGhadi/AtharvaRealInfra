'use client';

import { logoutAction } from '../login/actions';
import styles from './admin.module.css';

export default function LogoutButton() {
  return (
    <button onClick={() => logoutAction()} className={styles.logoutBtn}>
      Logout
    </button>
  );
}
