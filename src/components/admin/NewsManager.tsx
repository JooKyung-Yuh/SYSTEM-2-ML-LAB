'use client';

import { useState, useEffect } from 'react';
import styles from './NewsManager.module.css';
import AdminSection from './ui/AdminSection';
import AdminCard from './ui/AdminCard';
import AdminButton from './ui/AdminButton';
import ColorPicker from './ui/ColorPicker';

interface NewsLink {
  text: string;
  url: string;
}

interface NewsItem {
  id: string;
  date: string;
  title: string;
  description: string;
  links: NewsLink[];
  order: number;
}

interface NewsFormData {
  date: string;
  title: string;
  description: string;
  links: NewsLink[];
  color?: string;
}

export default function NewsManager() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState<NewsFormData>({
    date: '',
    title: '',
    description: '',
    links: [{ text: '', url: '' }],
    color: '#667eea'
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      if (response.ok) {
        const data = await response.json();
        setNewsItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredLinks = formData.links.filter(link => link.text && link.url);

    try {
      const url = editingItem ? `/api/news/${editingItem.id}` : '/api/news';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          links: filteredLinks,
        }),
      });

      if (response.ok) {
        await fetchNews();
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save news:', error);
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setFormData({
      date: item.date,
      title: item.title,
      description: item.description,
      links: item.links.length > 0 ? item.links : [{ text: '', url: '' }]
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchNews();
      }
    } catch (error) {
      console.error('Failed to delete news:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      date: '',
      title: '',
      description: '',
      links: [{ text: '', url: '' }],
      color: '#667eea'
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const addLinkField = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { text: '', url: '' }]
    });
  };

  const removeLinkField = (index: number) => {
    const newLinks = formData.links.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      links: newLinks.length > 0 ? newLinks : [{ text: '', url: '' }]
    });
  };

  const updateLink = (index: number, field: 'text' | 'url', value: string) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData({
      ...formData,
      links: newLinks
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading news...</div>;
  }

  return (
    <div className={styles.newsManager}>
      <AdminSection
        title="News & Announcements"
        description="Manage laboratory news, announcements, and updates"
        variant="filled"
        actions={
          <AdminButton
            onClick={() => setShowForm(true)}
            icon={<i className="fas fa-plus"></i>}
          >
            Add News
          </AdminButton>
        }
      >

      {showForm && (
        <div className={styles.formOverlay}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h3>{editingItem ? 'Edit News' : 'Add News'}</h3>
              <button onClick={resetForm} className={styles.closeButton}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Date</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g., September 24, 2025"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="News title"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="News description"
                  rows={3}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <ColorPicker
                  label="카드 색상"
                  value={formData.color}
                  onChange={(color) => setFormData({ ...formData, color })}
                />
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.linksHeader}>
                  <label>Links</label>
                  <AdminButton
                    type="button"
                    onClick={addLinkField}
                    variant="ghost"
                    size="sm"
                    icon={<i className="fas fa-plus"></i>}
                  >
                    Add Link
                  </AdminButton>
                </div>

                {formData.links.map((link, index) => (
                  <div key={index} className={styles.linkGroup}>
                    <input
                      type="text"
                      value={link.text}
                      onChange={(e) => updateLink(index, 'text', e.target.value)}
                      placeholder="Link text"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLink(index, 'url', e.target.value)}
                      placeholder="Link URL"
                    />
                    {formData.links.length > 1 && (
                      <AdminButton
                        type="button"
                        onClick={() => removeLinkField(index)}
                        variant="danger"
                        size="sm"
                        icon={<i className="fas fa-trash"></i>}
                      >
                        Remove
                      </AdminButton>
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.formActions}>
                <AdminButton type="button" onClick={resetForm} variant="secondary">
                  Cancel
                </AdminButton>
                <AdminButton type="submit" variant="primary">
                  {editingItem ? 'Update' : 'Create'}
                </AdminButton>
              </div>
            </form>
          </div>
        </div>
      )}

        <div className={styles.newsList}>
          {newsItems.map((item) => (
            <AdminCard
              key={item.id}
              title={item.title}
              subtitle={item.date}
              variant="primary"
              actions={
                <div className={styles.cardActions}>
                  <AdminButton
                    onClick={() => handleEdit(item)}
                    variant="ghost"
                    size="sm"
                    icon={<i className="fas fa-edit"></i>}
                  >
                    Edit
                  </AdminButton>
                  <AdminButton
                    onClick={() => handleDelete(item.id)}
                    variant="danger"
                    size="sm"
                    icon={<i className="fas fa-trash"></i>}
                  >
                    Delete
                  </AdminButton>
                </div>
              }
            >
              <p className={styles.newsDescription}>{item.description}</p>
              {item.links.length > 0 && (
                <div className={styles.newsLinks}>
                  {item.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.newsLink}
                    >
                      {link.text}
                    </a>
                  ))}
                </div>
              )}
            </AdminCard>
          ))}
        </div>
      </AdminSection>
    </div>
  );
}