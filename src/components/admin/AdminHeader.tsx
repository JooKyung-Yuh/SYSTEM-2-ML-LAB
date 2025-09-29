'use client';

import { useRouter } from 'next/navigation';
import styles from './AdminHeader.module.css';

interface AdminHeaderProps {
  userEmail?: string;
  onLogout?: () => void;
}

export default function AdminHeader({ userEmail, onLogout }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  };

  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <header className={styles.adminHeader}>
      <div className={styles.headerContent}>
        <div className={styles.logoSection}>
          <button onClick={handleHomeClick} className={styles.homeButton}>
            <i className="fas fa-home"></i>
            <span>Back to Site</span>
          </button>
          <h1 className={styles.title}>ML Lab Admin</h1>
        </div>

        {userEmail && (
          <div className={styles.userSection}>
            <span className={styles.userEmail}>{userEmail}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}