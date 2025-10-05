'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Add admin class to body to isolate CSS
    document.body.classList.add('admin-page');

    // Simple, one-time auth check on mount
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });

        if (response.ok) {
          console.log('Login page: User already authenticated, redirecting');
          router.replace('/admin/dashboard');
        }
      } catch {
        // User is not logged in, stay on login page - this is expected
      }
    };

    checkAuth();

    return () => {
      document.body.classList.remove('admin-page');
    };
  }, [router]); // Include router dependency

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { email, password: '***' });

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Ensure cookies are sent
      });

      console.log('Login response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);

        // Redirect immediately - let middleware handle authentication
        router.replace('/admin/dashboard');
      } else {
        const data = await response.json();
        console.error('Login failed:', data);
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader />
      <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logoSection}>
          <h1 className={styles.title}>ML Lab Admin</h1>
          <p className={styles.subtitle}>Korea University</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              placeholder="admin@mllab.korea.ac.kr"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className={styles.loginButton}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

      </div>
      </div>
    </>
  );
}