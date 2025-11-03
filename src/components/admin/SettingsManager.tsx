'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import styles from './SettingsManager.module.css';

interface SiteSettings {
  showNewsCarousel: boolean;
}

export default function SettingsManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
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
        body: JSON.stringify({ [field]: newValue }),
      });

      if (!response.ok) throw new Error('Failed to update settings');

      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
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
