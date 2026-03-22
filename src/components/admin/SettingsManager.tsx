'use client';

import { useState, useEffect } from 'react';
import { showToast } from '@/lib/toast';
import styles from './SettingsManager.module.css';

interface SiteSettings {
  showNewsCarousel: boolean;
  showRecruitmentBanner: boolean;
}

export default function SettingsManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Fetch error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch settings');
      }
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      showToast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (field: keyof SiteSettings) => {
    if (!settings) return;

    setSaving(true);
    const newValue = !settings[field];

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ [field]: newValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update error:', errorData);
        throw new Error(errorData.error || 'Failed to update settings');
      }

      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      showToast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      showToast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading settings...</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Failed to load settings</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Site Settings</h2>
        <p className={styles.description}>
          Manage global site settings and features
        </p>
      </div>

      <div className={styles.settingsList}>
        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <h3 className={styles.settingTitle}>News Carousel</h3>
            <p className={styles.settingDescription}>
              Show or hide the news carousel section on the home page
            </p>
          </div>
          <button
            className={`${styles.toggle} ${settings.showNewsCarousel ? styles.toggleOn : styles.toggleOff}`}
            onClick={() => handleToggle('showNewsCarousel')}
            disabled={saving}
            aria-label="Toggle news carousel visibility"
          >
            <span className={styles.toggleSlider}></span>
            <span className={styles.toggleLabel}>
              {settings.showNewsCarousel ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <h3 className={styles.settingTitle}>Recruitment Banner</h3>
            <p className={styles.settingDescription}>
              Show or hide the recruitment banner on the home page
            </p>
          </div>
          <button
            className={`${styles.toggle} ${settings.showRecruitmentBanner ? styles.toggleOn : styles.toggleOff}`}
            onClick={() => handleToggle('showRecruitmentBanner')}
            disabled={saving}
            aria-label="Toggle recruitment banner visibility"
          >
            <span className={styles.toggleSlider}></span>
            <span className={styles.toggleLabel}>
              {settings.showRecruitmentBanner ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      {/* Password Change Section */}
      <div className={styles.header} style={{ marginTop: '3rem' }}>
        <h2 className={styles.title}>Change Password</h2>
        <p className={styles.description}>Update your admin account password</p>
      </div>

      <div className={styles.settingsList}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (newPassword !== confirmPassword) {
              showToast.error('New passwords do not match');
              return;
            }
            if (newPassword.length < 6) {
              showToast.error('Password must be at least 6 characters');
              return;
            }
            setChangingPassword(true);
            try {
              const response = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ currentPassword, newPassword }),
              });
              if (response.ok) {
                showToast.success('Password changed successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              } else {
                const data = await response.json();
                showToast.error(data.error || 'Failed to change password');
              }
            } catch {
              showToast.error('Failed to change password');
            } finally {
              setChangingPassword(false);
            }
          }}
          style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }}
            />
          </div>
          <button
            type="submit"
            disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
            style={{
              padding: '0.625rem 1.25rem', backgroundColor: '#0066cc', color: 'white',
              border: 'none', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 600,
              cursor: 'pointer', opacity: changingPassword ? 0.5 : 1, alignSelf: 'flex-start',
            }}
          >
            {changingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerNote}>
          <i className="fas fa-info-circle"></i>
          Changes are applied immediately and will affect the public-facing site.
        </p>
      </div>
    </div>
  );
}
