'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import styles from './AdminHeader.module.css';

interface AdminHeaderProps {
  userEmail?: string;
  onLogout?: () => void;
}

export default function AdminHeader({ userEmail, onLogout }: AdminHeaderProps) {
  const router = useRouter();
  const [remaining, setRemaining] = useState<string>('');

  const fetchExpiry = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.exp) {
          // Store expiry in sessionStorage so it persists across page navigations
          sessionStorage.setItem('session_exp', String(data.exp));
        }
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchExpiry();

    const tick = setInterval(() => {
      const exp = sessionStorage.getItem('session_exp');
      if (!exp) return;

      const diff = parseInt(exp) - Math.floor(Date.now() / 1000);
      if (diff <= 0) {
        setRemaining('Expired');
        return;
      }
      const min = Math.floor(diff / 60);
      const sec = diff % 60;
      setRemaining(`${min}:${sec.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(tick);
  }, [fetchExpiry]);

  // Refresh token also updates the expiry
  useEffect(() => {
    const refreshAndUpdate = async () => {
      try {
        await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
        await fetchExpiry();
      } catch { /* ignore */ }
    };

    const refreshInterval = setInterval(refreshAndUpdate, 25 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [fetchExpiry]);

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        sessionStorage.removeItem('session_exp');
        router.push('/admin/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  };

  return (
    <header className={styles.adminHeader}>
      <div className={styles.headerContent}>
        <div className={styles.logoSection}>
          <button onClick={() => router.push('/')} className={styles.homeButton}>
            <i className="fas fa-home"></i>
            <span>Back to Site</span>
          </button>
          <h1 className={styles.title}>ML Lab Admin</h1>
        </div>

        <div className={styles.userSection}>
          {remaining && (
            <span className={styles.sessionTimer} style={{
              color: remaining === 'Expired' || (remaining && parseInt(remaining) < 5) ? '#ef4444' : '#9ca3af'
            }}>
              {remaining}
            </span>
          )}
          {userEmail && <span className={styles.userEmail}>{userEmail}</span>}
          <button onClick={handleLogout} className={styles.logoutButton}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
