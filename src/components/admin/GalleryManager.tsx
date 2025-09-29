'use client';

import { useState, useEffect } from 'react';
import styles from './Manager.module.css';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  category: string | null;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function GalleryManager() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['lab-activities', 'conferences', 'events', 'awards', 'facilities', 'milestones', 'collaborations'];

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/admin/gallery');
      if (response.ok) {
        const data = await response.json();
        setGalleryItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const itemData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      imageUrl: formData.get('imageUrl') as string,
      category: formData.get('category') as string,
      order: parseInt(formData.get('order') as string) || 0,
      published: formData.get('published') === 'on'
    };

    try {
      const url = editingItem
        ? `/api/admin/gallery/${editingItem.id}`
        : '/api/admin/gallery';

      const response = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });

      if (response.ok) {
        fetchGalleryItems();
        setEditingItem(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to save gallery item:', error);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      const response = await fetch(`/api/admin/gallery/${itemId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchGalleryItems();
      }
    } catch (error) {
      console.error('Failed to delete gallery item:', error);
    }
  };

  const handleTogglePublished = async (item: GalleryItem) => {
    try {
      const response = await fetch(`/api/admin/gallery/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, published: !item.published })
      });

      if (response.ok) {
        fetchGalleryItems();
      }
    } catch (error) {
      console.error('Failed to update gallery item:', error);
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return <div className={styles.loading}>Loading gallery...</div>;
  }

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h2>Gallery Management</h2>
        <button
          className={styles.addBtn}
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
        >
          Add Gallery Item
        </button>
      </div>

      {/* Category Filter */}
      <div className={styles.filters}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Gallery Grid */}
      <div className={styles.galleryGrid}>
        {filteredItems
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <div key={item.id} className={styles.galleryCard}>
              <div className={styles.imageContainer}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className={styles.galleryImage}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    📷
                  </div>
                )}
                <div className={styles.imageOverlay}>
                  <button
                    className={`${styles.toggleBtn} ${item.published ? styles.published : styles.unpublished}`}
                    onClick={() => handleTogglePublished(item)}
                  >
                    {item.published ? 'Published' : 'Draft'}
                  </button>
                </div>
              </div>

              <div className={styles.galleryCardContent}>
                <h3 className={styles.galleryTitle}>{item.title}</h3>
                {item.category && (
                  <span className={`${styles.category} ${styles[item.category.replace('-', '')]}`}>
                    {item.category.split('-').map(word =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                )}
                {item.description && (
                  <p className={styles.galleryDescription}>
                    {item.description.substring(0, 100)}
                    {item.description.length > 100 ? '...' : ''}
                  </p>
                )}
              </div>

              <div className={styles.galleryCardActions}>
                <button
                  className={styles.editBtn}
                  onClick={() => {
                    setEditingItem(item);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(item.id)}
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
              <h3>{editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}</h3>
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
                  defaultValue={editingItem?.title || ''}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="imageUrl">Image URL *</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  defaultValue={editingItem?.imageUrl || ''}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={editingItem?.category || 'lab-activities'}
                  >
                    <option value="">No category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.split('-').map(word =>
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
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
                    defaultValue={editingItem?.order || 0}
                    min="0"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  defaultValue={editingItem?.description || ''}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    name="published"
                    defaultChecked={editingItem?.published ?? true}
                  />
                  Published
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.saveBtn}>
                  {editingItem ? 'Update Item' : 'Add Item'}
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