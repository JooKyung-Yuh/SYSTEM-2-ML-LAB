'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import InlineNewsManager from '@/components/admin/InlineNewsManager';
import PagesManager from '@/components/admin/PagesManager';
import PeopleManager from '@/components/admin/PeopleManager';
import PublicationsManager from '@/components/admin/PublicationsManager';
import CoursesManager from '@/components/admin/CoursesManager';
import GalleryManager from '@/components/admin/GalleryManager';
import styles from './dashboard.module.css';

interface User {
  id: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('news');
  const router = useRouter();

  useEffect(() => {
    // Add admin class to body to isolate CSS
    document.body.classList.add('admin-page');

    // Simple user info fetch - middleware already handles authentication
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();

    return () => {
      document.body.classList.remove('admin-page');
    };
  }, []); // No periodic checks - middleware handles protection

  const handleLogout = async () => {
    try {
      // Try server logout
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if server logout fails, redirect anyway
      router.push('/admin/login');
    }
  };

  if (loading || !user) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Authenticating...</p>
      </div>
    );
  }

  return (
    <>
      <AdminHeader userEmail={user.email} onLogout={handleLogout} />
      <div className={styles.dashboard}>

      <div className={styles.container}>
        <nav className={styles.sidebar}>
          <ul className={styles.navList}>
            <li>
              <button
                className={`${styles.navButton} ${activeTab === 'news' ? styles.active : ''}`}
                onClick={() => setActiveTab('news')}
              >
                <i className="fas fa-newspaper"></i>
                News & Announcements
              </button>
            </li>
            <li>
              <button
                className={`${styles.navButton} ${activeTab === 'pages' ? styles.active : ''}`}
                onClick={() => setActiveTab('pages')}
              >
                <i className="fas fa-file-alt"></i>
                Pages
              </button>
            </li>
            <li>
              <button
                className={`${styles.navButton} ${activeTab === 'people' ? styles.active : ''}`}
                onClick={() => setActiveTab('people')}
              >
                <i className="fas fa-users"></i>
                People
              </button>
            </li>
            <li>
              <button
                className={`${styles.navButton} ${activeTab === 'publications' ? styles.active : ''}`}
                onClick={() => setActiveTab('publications')}
              >
                <i className="fas fa-book"></i>
                Publications
              </button>
            </li>
            <li>
              <button
                className={`${styles.navButton} ${activeTab === 'courses' ? styles.active : ''}`}
                onClick={() => setActiveTab('courses')}
              >
                <i className="fas fa-graduation-cap"></i>
                Courses
              </button>
            </li>
            <li>
              <button
                className={`${styles.navButton} ${activeTab === 'gallery' ? styles.active : ''}`}
                onClick={() => setActiveTab('gallery')}
              >
                <i className="fas fa-images"></i>
                Gallery
              </button>
            </li>
          </ul>
        </nav>

        <main className={styles.content}>
          {activeTab === 'news' && <InlineNewsManager />}
          {activeTab === 'pages' && <PagesManager />}
          {activeTab === 'people' && <PeopleManager />}
          {activeTab === 'publications' && <PublicationsManager />}
          {activeTab === 'courses' && <CoursesManager />}
          {activeTab === 'gallery' && <GalleryManager />}
        </main>
      </div>
      </div>
    </>
  );
}