'use client';

import { useState, useEffect } from 'react';
import styles from './NewsManager.module.css';

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

export default function NewsManager() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    description: '',
    links: [{ text: '', url: '' }]
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
      links: [{ text: '', url: '' }]
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
      <div className={styles.header}>
        <h2 className={styles.title}>News & Announcements</h2>
        <button
          onClick={() => setShowForm(true)}
          className={styles.addButton}
        >
          <i className="fas fa-plus"></i>
          Add News
        </button>
      </div>

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
                <div className={styles.linksHeader}>
                  <label>Links</label>
                  <button
                    type="button"
                    onClick={addLinkField}
                    className={styles.addLinkButton}
                  >
                    <i className="fas fa-plus"></i>
                    Add Link
                  </button>
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
                      <button
                        type="button"
                        onClick={() => removeLinkField(index)}
                        className={styles.removeLinkButton}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={resetForm} className={styles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveButton}>
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.newsList}>
        {newsItems.map((item) => (
          <div key={item.id} className={styles.newsCard}>
            <div className={styles.newsContent}>
              <div className={styles.newsDate}>{item.date}</div>
              <h3 className={styles.newsTitle}>{item.title}</h3>
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
            </div>
            <div className={styles.newsActions}>
              <button
                onClick={() => handleEdit(item)}
                className={styles.editButton}
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className={styles.deleteButton}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}