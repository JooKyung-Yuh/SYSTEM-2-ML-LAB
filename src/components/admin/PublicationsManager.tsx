'use client';

import { useState, useEffect } from 'react';
import styles from './Manager.module.css';

interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  url: string | null;
  pdfUrl: string | null;
  category: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PublicationsManager() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const categories = ['conference', 'journal', 'workshop'];

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await fetch('/api/admin/publications');
      if (response.ok) {
        const data = await response.json();
        setPublications(data);
      }
    } catch (error) {
      console.error('Failed to fetch publications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const publicationData = {
      title: formData.get('title') as string,
      authors: formData.get('authors') as string,
      venue: formData.get('venue') as string,
      year: parseInt(formData.get('year') as string),
      url: formData.get('url') as string,
      pdfUrl: formData.get('pdfUrl') as string,
      category: formData.get('category') as string,
      order: parseInt(formData.get('order') as string) || 0,
      published: formData.get('published') === 'on'
    };

    try {
      const url = editingPublication
        ? `/api/admin/publications/${editingPublication.id}`
        : '/api/admin/publications';

      const response = await fetch(url, {
        method: editingPublication ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(publicationData)
      });

      if (response.ok) {
        fetchPublications();
        setEditingPublication(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to save publication:', error);
    }
  };

  const handleDelete = async (publicationId: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;

    try {
      const response = await fetch(`/api/admin/publications/${publicationId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchPublications();
      }
    } catch (error) {
      console.error('Failed to delete publication:', error);
    }
  };

  const handleTogglePublished = async (publication: Publication) => {
    try {
      const response = await fetch(`/api/admin/publications/${publication.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...publication, published: !publication.published })
      });

      if (response.ok) {
        fetchPublications();
      }
    } catch (error) {
      console.error('Failed to update publication:', error);
    }
  };

  const filteredPublications = publications.filter(pub => {
    if (selectedCategory !== 'all' && pub.category !== selectedCategory) return false;
    if (selectedYear !== 'all' && pub.year.toString() !== selectedYear) return false;
    return true;
  });

  const years = [...new Set(publications.map(pub => pub.year.toString()))].sort((a, b) => parseInt(b) - parseInt(a));

  if (loading) {
    return <div className={styles.loading}>Loading publications...</div>;
  }

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h2>Publications Management</h2>
        <button
          className={styles.addBtn}
          onClick={() => {
            setEditingPublication(null);
            setShowForm(true);
          }}
        >
          Add Publication
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Years</option>
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Publications List */}
      <div className={styles.list}>
        {filteredPublications
          .sort((a, b) => b.year - a.year || a.order - b.order)
          .map((publication) => (
            <div key={publication.id} className={styles.listCard}>
              <div className={styles.cardHeader}>
                <div className={styles.publicationInfo}>
                  <h3 className={styles.publicationTitle}>{publication.title}</h3>
                  <p className={styles.authors}>{publication.authors}</p>
                  <div className={styles.publicationMeta}>
                    <span className={styles.venue}>{publication.venue}</span>
                    <span className={styles.year}>{publication.year}</span>
                    <span className={`${styles.category} ${styles[publication.category]}`}>
                      {publication.category}
                    </span>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button
                    className={`${styles.toggleBtn} ${publication.published ? styles.published : styles.unpublished}`}
                    onClick={() => handleTogglePublished(publication)}
                  >
                    {publication.published ? 'Published' : 'Draft'}
                  </button>
                </div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.links}>
                  {publication.url && (
                    <a
                      href={publication.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      🔗 Paper
                    </a>
                  )}
                  {publication.pdfUrl && (
                    <a
                      href={publication.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      📄 PDF
                    </a>
                  )}
                </div>
              </div>

              <div className={styles.cardFooter}>
                <button
                  className={styles.editBtn}
                  onClick={() => {
                    setEditingPublication(publication);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(publication.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{editingPublication ? 'Edit Publication' : 'Add New Publication'}</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={editingPublication?.title || ''}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="authors">Authors *</label>
                <input
                  type="text"
                  id="authors"
                  name="authors"
                  defaultValue={editingPublication?.authors || ''}
                  placeholder="e.g., John Doe, Jane Smith, et al."
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="venue">Venue *</label>
                  <input
                    type="text"
                    id="venue"
                    name="venue"
                    defaultValue={editingPublication?.venue || ''}
                    placeholder="e.g., ICML 2024"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="year">Year *</label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    defaultValue={editingPublication?.year || new Date().getFullYear()}
                    min="1900"
                    max="2100"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={editingPublication?.category || 'conference'}
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="order">Order</label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    defaultValue={editingPublication?.order || 0}
                    min="0"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="url">Paper URL</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  defaultValue={editingPublication?.url || ''}
                  placeholder="https://..."
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="pdfUrl">PDF URL</label>
                <input
                  type="url"
                  id="pdfUrl"
                  name="pdfUrl"
                  defaultValue={editingPublication?.pdfUrl || ''}
                  placeholder="https://..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    name="published"
                    defaultChecked={editingPublication?.published ?? true}
                  />
                  Published
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.saveBtn}>
                  {editingPublication ? 'Update Publication' : 'Add Publication'}
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}