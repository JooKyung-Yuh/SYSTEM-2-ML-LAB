'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import NewsManager from '@/components/admin/NewsManager';
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
    checkAuth();

    return () => {
      document.body.classList.remove('admin-page');
    };
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
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
          {activeTab === 'news' && <NewsManager />}
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